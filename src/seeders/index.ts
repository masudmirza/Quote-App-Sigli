import { Service } from "typedi";
import { CatalogItemSeeder } from "./catalog-item.seeder";
import { UserSeeder } from "./user.seeder";
import { logger } from "../utils/logger";
import { DbContext } from "../database/db-context";

@Service()
export class SeederService {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly catalogItemSeeder: CatalogItemSeeder,
    private readonly dbContext: DbContext,
  ) {}

  async runAll() {
    await this.userSeeder.run();
    await this.catalogItemSeeder.run();
    logger.info("Seeding completed successfully.");
  }
}
