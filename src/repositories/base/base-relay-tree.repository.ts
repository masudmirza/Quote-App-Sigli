import { ObjectLiteral, FindManyOptions, SelectQueryBuilder } from "typeorm";

import { BaseTreeRepository } from "./base-tree-repository";
import {
  ClassType,
  Connection,
  ConnectionArgs,
  getConnectionFromArray,
  getPagingParameters,
} from "../../graphql/relay";

export class BaseRelayTreeRepository<
  T extends ObjectLiteral,
> extends BaseTreeRepository<T> {
  async findAndPaginate<TNode extends T>(
    condition: FindManyOptions<T>,
    args: ConnectionArgs,
    nodeCls: ClassType<TNode>,
  ): Promise<Connection<TNode>> {
    const { limit, offset } = getPagingParameters(args);
    const [entities, count] = await this.findAndCount({
      ...condition,
      skip: offset,
      take: limit,
    });

    return getConnectionFromArray(entities, nodeCls, args, count) as Connection<TNode>;
  }

  async getManyAndPaginate<TNode extends T>(
    queryBuilder: SelectQueryBuilder<T>,
    args: ConnectionArgs,
    nodeCls: ClassType<TNode>,
  ): Promise<Connection<TNode>> {
    const { limit, offset } = getPagingParameters(args);
    const [entities, count] = await queryBuilder
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    return getConnectionFromArray(entities, nodeCls, args, count) as Connection<TNode>;
  }

  async getMany<TNode extends T>(
    queryBuilder: SelectQueryBuilder<T>,
    nodeCls: ClassType<TNode>,
  ): Promise<Connection<TNode>> {
    const [entities, count] = await queryBuilder.getManyAndCount();

    return getConnectionFromArray(
      entities,
      nodeCls,
      { pageSize: count },
      count,
    ) as Connection<TNode>;
  }
}
