import { IAuditableEntity } from "./auditable-entity.interface";

export interface IEditableEntity extends IAuditableEntity {
  updatedAt: Date;

  version: number;
}
