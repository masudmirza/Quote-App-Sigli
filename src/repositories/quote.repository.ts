import { Service } from "typedi";
import { DataSource } from "typeorm";
import { BaseRelayRepository } from "./base/base-relay.repository";
import { QuoteEntity } from "../domain/entities/quote.entity";

@Service()
export class QuoteRepository extends BaseRelayRepository<QuoteEntity> {
  constructor(dataSource: DataSource) {
    super(QuoteEntity, dataSource.manager);
  }
}
