import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { QuoteEntity } from "./quote.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "likes" })
@Unique(["user", "quote"])
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => QuoteEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "quote_id" })
  quote!: QuoteEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;
}
