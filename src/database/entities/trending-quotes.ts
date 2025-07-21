import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { ulid } from "ulid";
import { IAuditableEntity } from "../interfaces/auditable-entity.interface";
import { QuoteEntity } from "./quote.entity";

@Entity({ name: "trending_quotes" })
export class TrendingQuoteEntity implements IAuditableEntity {
  @PrimaryColumn({ type: "varchar", length: 26 })
  id!: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @ManyToOne(() => QuoteEntity, { onDelete: "CASCADE" })
  quote!: QuoteEntity;

  @Column()
  likeCount!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;
}
