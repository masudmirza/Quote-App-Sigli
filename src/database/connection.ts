import { DataSource } from "typeorm";
import { config } from "../config";
import { CatalogItemEntity } from "../domain/entities/catalog-item.entity";
import { LikeEntity } from "../domain/entities/like.entity";
import { QuoteEntity } from "../domain/entities/quote.entity";
import { UserEntity } from "../domain/entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  username: config.POSTGRES_USERNAME,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DATABASE,
  entities: [UserEntity, QuoteEntity, LikeEntity, CatalogItemEntity],
  migrations: [
    config.NODE_ENV === "production"
      ? "dist/database/migrations/*.js"
      : "src/database/migrations/*.ts",
  ],
  synchronize: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false, // Azure uses self-signed certs
    ca: undefined,
    key: undefined,
    cert: undefined,
  },
});
