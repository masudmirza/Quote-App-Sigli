import { DataSource } from "typeorm";
import { Container, Service } from "typedi";
import { UserRepository } from "./repositories/user.repository";
import { QuoteRepository } from "./repositories/quote.repository";
import { LikeRepository } from "./repositories/like-repository";
import { CatalogItemRepository } from "./repositories/catalog-item.repository";

@Service()
export class DbContext {
  constructor(
    public readonly users: UserRepository = Container.get(UserRepository),
    public readonly quotes: QuoteRepository = Container.get(QuoteRepository),
    public readonly likes: LikeRepository = Container.get(LikeRepository),
    public readonly catalogItems: CatalogItemRepository = Container.get(
      CatalogItemRepository,
    ),
  ) {}
}
