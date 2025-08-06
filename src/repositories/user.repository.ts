import { Service } from "typedi";
import { DataSource } from "typeorm";
import { BaseRelayRepository } from "./base/base-relay.repository";
import { UserEntity } from "../domain/entities/user.entity";

@Service()
export class UserRepository extends BaseRelayRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }
}
