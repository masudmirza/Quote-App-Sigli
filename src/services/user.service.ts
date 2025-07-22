import { Service } from "typedi";
import { DataSource } from "typeorm";
import { DbContext } from "../database/db-context";
import { CatalogItem } from "../enums/catalog-item.enum";
import {
  Connection,
  ConnectionArgs,
  getConnectionFromArray,
  getPagingParameters,
} from "../graphql/relay";
import { QuoteNode } from "../graphql/types/quote/quote.type";
import { BadRequestError, NotFoundError } from "../utils/errors";

@Service()
export class UserService {
  constructor(
    private readonly db: DbContext,
    private readonly dataSource: DataSource,
  ) {}

  async getLikedQuotes(
    userId: string,
    args: ConnectionArgs,
  ): Promise<Connection<QuoteNode>> {
    const { limit, offset } = getPagingParameters(args);

    const qb = this.db.quotes
      .createQueryBuilder("quote")
      .innerJoin("quote.likes", "like", '"like"."user_id" = :userId', { userId })
      .leftJoinAndSelect("quote.tags", "tag")
      .skip(offset)
      .take(limit)
      .orderBy("quote.createdAt", "DESC");

    const [entities, totalCount] = await qb.getManyAndCount();

    const nodes: QuoteNode[] = entities.map((entity) => {
      const node = new QuoteNode();
      node.id = entity.id;
      node.text = entity.text;
      node.author = entity.author;
      node.createdAt = entity.createdAt;
      return node;
    });

    return getConnectionFromArray(nodes, QuoteNode, args, totalCount);
  }

  async selectMood(userId: string, moodId: string): Promise<{ success: boolean }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(this.db.users.target);
      const catalogRepo = queryRunner.manager.getRepository(this.db.catalogItems.target);

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ["lastMoodSelection"],
      });
      if (!user) throw new NotFoundError("User not found");

      const mood = await catalogRepo.findOne({
        where: { id: moodId, type: CatalogItem.MOOD },
      });
      if (!mood) throw new NotFoundError("Mood not found");

      const lastSelected = user.lastMoodSelectionAt;
      const now = new Date();

      if (lastSelected) {
        const lastDate = lastSelected.toISOString().slice(0, 10);
        const currentDate = now.toISOString().slice(0, 10);
        if (lastDate === currentDate) {
          throw new BadRequestError("Mood already selected today");
        }
      }

      user.lastMoodSelection = mood;
      user.lastMoodSelectionAt = now;

      await userRepo.save(user);
      await queryRunner.commitTransaction();

      return { success: true };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
