import { DataSource } from "typeorm";
import { config } from "../config";
import { CatalogItemEntity } from "./entities/catalog-item.entity";
import { LikeEntity } from "./entities/like.entity";
import { QuoteEntity } from "./entities/quote.entity";
import { UserEntity } from "./entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  username: config.POSTGRES_USERNAME,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DATABASE,
  entities: [UserEntity, QuoteEntity, LikeEntity, CatalogItemEntity],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false, // Azure uses self-signed certs
    ca: undefined,
    key: undefined,
    cert: undefined,
  },
});
