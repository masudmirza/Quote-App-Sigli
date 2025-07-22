import { Service } from "typedi";
import { logger } from "../../utils/logger";
import { CatalogItemSeeder } from "../seeders/catalog-item.seeder";
import { UserSeeder } from "../seeders/user.seeder";

@Service()
export class SeederService {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly catalogItemSeeder: CatalogItemSeeder,
  ) {}

  async runAll() {
    await this.userSeeder.run();
    await this.catalogItemSeeder.run();
    logger.info("Seeding completed successfully.");
  }
}
