import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  BeforeInsert,
  Unique,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from "typeorm";
import { ulid } from "ulid";
import { IEditableEntity } from "../interfaces/editable-entity.interface";
import { ISoftDeletableEntity } from "../interfaces/soft-deletable-entity.interface";
import { CatalogItem } from "../enums/catalog-item.enum";

@Entity({ name: "catalog_items" })
export class CatalogItemEntity implements IEditableEntity, ISoftDeletableEntity {
  @PrimaryColumn({ type: "varchar", length: 26 })
  id!: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @Column()
  name!: string;

  @Column({ type: "enum", enum: CatalogItem })
  type!: CatalogItem;

  @Column({ type: "varchar", name: "parent_id", nullable: true })
  parentId?: string;

  @ManyToOne(() => CatalogItemEntity, (item) => item.children, {
    nullable: true,
    onDelete: "CASCADE",
    eager: false,
  })
  parent?: CatalogItemEntity;

  @OneToMany(() => CatalogItemEntity, (item) => item.parent)
  children?: CatalogItemEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp with time zone" })
  deletedAt!: Date;

  @VersionColumn({ default: 0 })
  version!: number;
}
