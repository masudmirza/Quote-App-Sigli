import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { ulid } from "ulid";
import { IAuditableEntity } from "../interfaces/auditable-entity.interface";
import { LikeEntity } from "./like.entity";
import { CatalogItemEntity } from "./catalog-item.entity";

@Entity({ name: "quotes" })
export class QuoteEntity implements IAuditableEntity {
  @PrimaryColumn({ type: "varchar", length: 26 })
  id!: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @Column({ type: "int", name: "external_id", unique: true })
  externalId!: number;

  @Column()
  text!: string;

  @Column()
  author!: string;

  @Column({ default: 0 })
  likeCount!: number;

  @OneToMany(() => LikeEntity, (like) => like.quote)
  likes!: LikeEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;

  @ManyToMany(() => CatalogItemEntity)
  @JoinTable({
    name: "quote_tags",
    joinColumn: { name: "quote_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "catalog_item_id", referencedColumnName: "id" },
  })
  tags!: CatalogItemEntity[];
}
