import DataLoader from "dataloader";
import { In } from "typeorm";
import { Service } from "typedi";
import { DbContext } from "../../database/db-context";
import { CatalogItemEntity } from "../../domain/entities/catalog-item.entity";

@Service()
export class CatalogItemLoader {
  constructor(private readonly dbContext: DbContext) {}

  readonly byId = new DataLoader<string, CatalogItemEntity | null>(
    async (ids: readonly string[]) => {
      const items = await this.dbContext.catalogItems.find({
        where: { id: In(ids as string[]) },
      });

      return ids.map((id) => items.find((item) => item.id === id) || null);
    },
  );
}
