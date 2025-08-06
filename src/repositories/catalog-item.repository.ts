import { Service } from "typedi";
import { DataSource } from "typeorm";
import { BaseRelayTreeRepository } from "./base/base-relay-tree.repository";
import { CatalogItemEntity } from "../domain/entities/catalog-item.entity";

@Service()
export class CatalogItemRepository extends BaseRelayTreeRepository<CatalogItemEntity> {
  constructor(dataSource: DataSource) {
    super(CatalogItemEntity, dataSource.manager);
  }
}
