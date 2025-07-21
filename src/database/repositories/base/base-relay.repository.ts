import { Repository, FindManyOptions, SelectQueryBuilder, ObjectLiteral } from "typeorm";
import {
  ClassType,
  Connection,
  ConnectionArgs,
  getConnectionFromArray,
  getPagingParameters,
} from "../../../graphql/relay";

export class BaseRelayRepository<T extends ObjectLiteral> extends Repository<T> {
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
}
