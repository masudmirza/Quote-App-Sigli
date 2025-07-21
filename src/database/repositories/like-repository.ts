import { Service } from "typedi";
import { DataSource } from "typeorm";
import { BaseRelayRepository } from "./base/base-relay.repository";
import { LikeEntity } from "../entities/like.entity";

@Service()
export class LikeRepository extends BaseRelayRepository<LikeEntity> {
  constructor(dataSource: DataSource) {
    super(LikeEntity, dataSource.manager);
  }
}
