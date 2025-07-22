import axios from "axios";
import { Service } from "typedi";
import { DataSource, SelectQueryBuilder } from "typeorm";
import { DbContext } from "../database/db-context";
import { QuoteEntity } from "../database/entities/quote.entity";
import { UserEntity } from "../database/entities/user.entity";
import { CatalogItem } from "../enums/catalog-item.enum";
import { CustomError } from "../utils/errors";
import { QuoteOrderBy } from "../enums/quote.enum";
import { QuoteNode, QuoteWhereInput } from "../graphql/types/quote/quote.type";
import {
  Connection,
  ConnectionArgs,
  getConnectionFromArray,
  getPagingParameters,
} from "../graphql/relay";
import { plainToInstance } from "class-transformer";
import { QuoteResponse, QuoteResponseDto } from "../dtos/quote.dto";

@Service()
export class QuoteService {
  constructor(
    private readonly dbContext: DbContext,
    private readonly dataSource: DataSource,
  ) {}

  async getRandomQuote(): Promise<QuoteResponse> {
    const response = await axios.get("https://dummyjson.com/quotes/random");
    const { id, quote, author } = response.data;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const quoteRepo = queryRunner.manager.getRepository(this.dbContext.quotes.target);
      const catalogItemRepo = queryRunner.manager.getRepository(
        this.dbContext.catalogItems.target,
      );

      let quoteEntity = await quoteRepo.findOne({
        where: { id },
        relations: ["tags"],
      });

      if (!quoteEntity) {
        quoteEntity = quoteRepo.create({ id, text: quote, author });
        const allTags = await catalogItemRepo.find({ where: { type: CatalogItem.TAG } });
        const shuffled = allTags.sort(() => 0.5 - Math.random());
        quoteEntity.tags = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);

        await quoteRepo.save(quoteEntity);
      }

      await queryRunner.commitTransaction();
      return QuoteResponseDto.parse(quoteEntity);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      const statusCode = error?.statusCode;
      const errorCode = error?.errorCode;

      throw new CustomError(statusCode, errorCode);
    } finally {
      await queryRunner.release();
    }
  }

  async toggleLike(userId: string, quoteId: string): Promise<{ liked: boolean }> {
    const likeRepo = this.dbContext.likes;
    const existing = await likeRepo.findOne({
      where: { user: { id: userId }, quote: { id: quoteId } },
    });

    if (existing) {
      await likeRepo.remove(existing);
      return { liked: false };
    }

    const like = likeRepo.create({
      user: { id: userId } as UserEntity,
      quote: { id: quoteId } as QuoteEntity,
    });

    await likeRepo.save(like);
    return { liked: true };
  }

  async findAllWithPagination(
    args: ConnectionArgs & {
      where?: QuoteWhereInput;
      orderBy?: QuoteOrderBy;
    },
    userId: string,
  ): Promise<Connection<QuoteNode>> {
    const { limit, offset } = getPagingParameters(args);

    const user = await this.dbContext.users.findOne({
      where: { id: userId },
      relations: ["lastMoodSelection"],
    });

    const moodTagEntities = await this.dbContext.catalogItems.find({
      where: {
        parentId: user?.lastMoodSelection?.id,
        type: CatalogItem.TAG,
      },
    });
    const moodTagIds = moodTagEntities.map((tag) => tag.id);

    const qb = this.dbContext.quotes
      .createQueryBuilder("quote")
      .leftJoinAndSelect("quote.tags", "tag")
      .loadRelationCountAndMap("quote.likesCount", "quote.likes");

    if (moodTagIds.length) {
      qb.innerJoin("quote.tags", "moodTag", "moodTag.id IN (:...moodTagIds)", {
        moodTagIds,
      });
    }

    this.buildWhere(qb, args.where);
    this.buildOrderBy(qb, args.orderBy);

    qb.skip(offset).take(limit);

    const [entities, totalCount] = await qb.getManyAndCount();

    const nodes = plainToInstance(QuoteNode, entities);

    return getConnectionFromArray(nodes, QuoteNode, args, totalCount);
  }

  private buildWhere(
    queryBuilder: SelectQueryBuilder<QuoteEntity>,
    where?: QuoteWhereInput,
  ) {
    if (!where) return;

    if (where.quoteContains) {
      queryBuilder.andWhere("quote.quote ILIKE :quoteContains", {
        quoteContains: `%${where.quoteContains}%`,
      });
    }

    if (where.author) {
      queryBuilder.andWhere("quote.author ILIKE :author", {
        author: `%${where.author}%`,
      });
    }

    if (where.createdAfter) {
      queryBuilder.andWhere("quote.createdAt >= :createdAfter", {
        createdAfter: where.createdAfter,
      });
    }

    if (where.createdBefore) {
      queryBuilder.andWhere("quote.createdAt <= :createdBefore", {
        createdBefore: where.createdBefore,
      });
    }
  }

  private buildOrderBy(qb: SelectQueryBuilder<QuoteEntity>, orderBy?: QuoteOrderBy) {
    switch (orderBy) {
      case QuoteOrderBy.CREATED_AT_ASC:
        qb.orderBy("quote.createdAt", "ASC");
        break;
      case QuoteOrderBy.CREATED_AT_DESC:
        qb.orderBy("quote.createdAt", "DESC");
        break;
      case QuoteOrderBy.AUTHOR_ASC:
        qb.orderBy("quote.author", "ASC");
        break;
      case QuoteOrderBy.AUTHOR_DESC:
        qb.orderBy("quote.author", "DESC");
      case QuoteOrderBy.LIKE_ASC:
        qb.orderBy("quote.likesCount", "ASC");
        break;
      case QuoteOrderBy.LIKE_DESC:
        qb.orderBy("quote.likesCount", "DESC");
        break;
      default:
        qb.orderBy("quote.createdAt", "DESC");
    }
  }
}
