import { Service } from "typedi";
import { DataSource } from "typeorm";
import { CatalogItemEntity } from "../entities/catalog-item.entity";
import { BaseRelayTreeRepository } from "./base/base-relay-tree.repository";

@Service()
export class CatalogItemRepository extends BaseRelayTreeRepository<CatalogItemEntity> {
  constructor(dataSource: DataSource) {
    super(CatalogItemEntity, dataSource.manager);
  }
}
