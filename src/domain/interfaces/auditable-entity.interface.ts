import { IBaseEntity } from "./base-entity.interface";

export interface IAuditableEntity extends IBaseEntity {
  createdAt: Date;
}
