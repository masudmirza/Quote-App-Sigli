import { Service } from "typedi";
import { DataSource, IsNull, Not } from "typeorm";
import { CatalogItem } from "../domain/enums/catalog-item.enum";
import { DbContext } from "../database/db-context";

@Service()
export class CatalogItemSeeder {
  constructor(
    private readonly dbContext: DbContext,
    private readonly dataSource: DataSource,
  ) {}

  async run(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const catalogRepo = queryRunner.manager.getRepository(
        this.dbContext.catalogItems.target,
      );

      const moodToTags = {
        happy: ["joy", "laughter", "sunshine"],
        sad: ["tears", "loss", "grief"],
        motivated: ["ambition", "grind", "focus"],
      };

      for (const [moodName, tags] of Object.entries(moodToTags)) {
        let mood = await catalogRepo.findOne({
          where: {
            name: moodName,
            type: CatalogItem.MOOD,
            deletedAt: Not(IsNull()),
          },
          withDeleted: true,
        });

        if (!mood) {
          mood = catalogRepo.create({
            name: moodName,
            type: CatalogItem.MOOD,
          });
          await catalogRepo.save(mood);
        }

        for (const tagName of tags) {
          const existingTag = await catalogRepo.findOne({
            where: {
              name: tagName,
              type: CatalogItem.TAG,
              parentId: mood.id,
              deletedAt: Not(IsNull()),
            },
            withDeleted: true,
          });

          if (!existingTag) {
            const tag = catalogRepo.create({
              name: tagName,
              type: CatalogItem.TAG,
              parentId: mood.id,
            });
            await catalogRepo.save(tag);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
