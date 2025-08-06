import { Service } from "typedi";
import { CatalogItemRepository } from "../repositories/catalog-item.repository";
import { LikeRepository } from "../repositories/like-repository";
import { QuoteRepository } from "../repositories/quote.repository";
import { UserRepository } from "../repositories/user.repository";

@Service()
export class DbContext {
  constructor(
    public readonly users: UserRepository,
    public readonly quotes: QuoteRepository,
    public readonly likes: LikeRepository,
    public readonly catalogItems: CatalogItemRepository,
  ) {}
}
