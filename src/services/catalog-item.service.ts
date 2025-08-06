import { Service } from "typedi";
import { DataSource, SelectQueryBuilder } from "typeorm";
import { DbContext } from "../database/db-context";
import { CatalogItemEntity } from "../domain/entities/catalog-item.entity";
import {
  CatalogItemResponse,
  CatalogItemResponseDto,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
} from "../dtos/catalog-item.dto";
import { CatalogItem, CatalogItemOrderBy } from "../domain/enums/catalog-item.enum";
import { Connection, ConnectionArgs, getPagingParameters } from "../graphql/relay";
import {
  CatalogItemNode,
  CatalogItemWhereInput,
} from "../graphql/types/catalog-item/catalog-item.types";
import { BadRequestError, CustomError } from "../utils/errors";

@Service()
export class CatalogItemService {
  constructor(
    private readonly db: DbContext,
    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateCatalogItemRequest): Promise<CatalogItemResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(this.db.catalogItems.target);
      const { name, type, parentId } = input;

      console.log("input ", input);

      const exists = await repo.findOneBy({
        name,
        type,
        parentId: parentId ?? undefined,
      });
      if (exists) throw new BadRequestError(`${type} with name "${name}" already exists`);

      if (type === CatalogItem.TAG) {
        const parent = await repo.findOneBy({
          id: parentId!,
          type: CatalogItem.MOOD,
        });
        if (!parent) throw new BadRequestError("Specified parent mood does not exist");
      }

      const item = repo.create({ name, type, parentId: parentId ?? undefined });
      const savedItem = await repo.save(item);

      await queryRunner.commitTransaction();
      return CatalogItemResponseDto.parse(savedItem);
    } catch (error: any) {
      console.log("error ", error);

      await queryRunner.rollbackTransaction();
      throw new CustomError(error.statusCode || 500, error.errorCode || error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, input: UpdateCatalogItemRequest) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(this.db.catalogItems.target);
      const item = await repo.findOneBy({ id });
      if (!item) throw new BadRequestError("Catalog item not found");

      if (input.name) {
        const exists = await repo.findOneBy({
          name: input.name,
          type: input.type ?? item.type,
        });

        if (exists && exists.id !== id) {
          throw new BadRequestError(
            `Another ${item.type} with the same name already exists`,
          );
        }

        item.name = input.name;
      }

      if (input.type) item.type = input.type;

      const savedItem = await repo.save(item);
      await queryRunner.commitTransaction();
      return CatalogItemResponseDto.parse(savedItem);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new CustomError(error.statusCode || 500, error.errorCode);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(this.db.catalogItems.target);

      const item = await repo.findOneBy({ id });
      if (!item) throw new BadRequestError("Catalog item not found");

      if (item.type === CatalogItem.MOOD) {
        const tags = await repo.find({
          where: { parentId: item.id, type: CatalogItem.TAG },
        });

        if (tags.length > 0) {
          await repo.softRemove(tags);
        }
      }

      await repo.softRemove(item);

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new CustomError(error.statusCode || 500, error.errorCode);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllWithPagination(
    args: ConnectionArgs & {
      where?: CatalogItemWhereInput;
      orderBy?: CatalogItemOrderBy;
    },
  ): Promise<Connection<CatalogItemNode>> {
    const { limit, offset } = getPagingParameters(args);

    const queryBuilder = this.db.catalogItems.createQueryBuilder("ci");

    this.buildWhere(queryBuilder, args.where);
    this.buildOrderBy(queryBuilder, args.orderBy);

    queryBuilder.skip(offset);
    queryBuilder.take(limit);

    return this.db.catalogItems.getManyAndPaginate(queryBuilder, args, CatalogItemEntity);
  }

  private buildWhere(
    queryBuilder: SelectQueryBuilder<CatalogItemEntity>,
    where?: CatalogItemWhereInput,
  ) {
    if (!where) return;

    if (where.name) {
      queryBuilder.andWhere("ci.name ILIKE :name", { name: `%${where.name}%` });
    }

    if (where.categoryId) {
      queryBuilder.andWhere("ci.categoryId = :categoryId", {
        categoryId: where.categoryId,
      });
    }

    if (where.createdAfter) {
      queryBuilder.andWhere("ci.createdAt >= :createdAfter", {
        createdAfter: where.createdAfter,
      });
    }

    if (where.createdBefore) {
      queryBuilder.andWhere("ci.createdAt <= :createdBefore", {
        createdBefore: where.createdBefore,
      });
    }
  }

  private buildOrderBy(
    queryBuilder: SelectQueryBuilder<CatalogItemEntity>,
    orderBy?: CatalogItemOrderBy,
  ) {
    switch (orderBy) {
      case CatalogItemOrderBy.NAME_ASC:
        queryBuilder.orderBy("ci.name", "ASC");
        break;

      case CatalogItemOrderBy.NAME_DESC:
        queryBuilder.orderBy("ci.name", "DESC");
        break;

      case CatalogItemOrderBy.CREATED_AT_ASC:
        queryBuilder.orderBy("ci.createdAt", "ASC");
        break;

      case CatalogItemOrderBy.CREATED_AT_DESC:
      default:
        queryBuilder.orderBy("ci.createdAt", "DESC");
        break;
    }
  }
}
