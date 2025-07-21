import { DataSource, useContainer } from "typeorm";
import { Container } from "typedi";
import { config } from "../config";
import { UserEntity } from "./entities/user.entity";
import { QuoteEntity } from "./entities/quote.entity";
import { LikeEntity } from "./entities/like.entity";
import { CatalogItemEntity } from "./entities/catalog-item.entity";
import { TrendingQuoteEntity } from "./entities/trending-quotes";

// useContainer(Container);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.POSTGRES_HOST,
  port: config.POSTGRES_PORT,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  entities: [UserEntity, QuoteEntity, LikeEntity, CatalogItemEntity, TrendingQuoteEntity],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
  logging: true,
});
