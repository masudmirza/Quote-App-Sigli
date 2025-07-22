import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { ulid } from "ulid";
import { IAuditableEntity } from "../interfaces/auditable-entity.interface";
import { LikeEntity } from "./like.entity";
import { CatalogItemEntity } from "./catalog-item.entity";

@Entity({ name: "users" })
export class UserEntity implements IAuditableEntity {
  @PrimaryColumn({ type: "varchar", length: 26 })
  id!: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes!: LikeEntity[];

  @ManyToOne(() => CatalogItemEntity, { nullable: true, eager: true })
  @JoinColumn({ name: "last_mood_selection_id" })
  lastMoodSelection?: CatalogItemEntity;

  @Column({ type: "timestamp with time zone", nullable: true })
  lastMoodSelectionAt?: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt!: Date;
}
