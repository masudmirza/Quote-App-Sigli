import { Service } from "typedi";
import { DataSource } from "typeorm";
import { BaseRelayRepository } from "./base/base-relay.repository";
import { TrendingQuoteEntity } from "../entities/trending-quotes";

@Service()
export class TrendingQuoteRepository extends BaseRelayRepository<TrendingQuoteEntity> {
  constructor(dataSource: DataSource) {
    super(TrendingQuoteEntity, dataSource.manager);
  }
}
