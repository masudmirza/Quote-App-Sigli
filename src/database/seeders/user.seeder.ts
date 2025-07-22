import bcrypt from "bcryptjs";
import { Service } from "typedi";
import { DataSource } from "typeorm";
import { DbContext } from "../db-context";

@Service()
export class UserSeeder {
  constructor(
    private readonly dbContext: DbContext,
    private readonly dataSource: DataSource,
  ) {}

  async run(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const userRepo = queryRunner.manager.getRepository(this.dbContext.users.target);

      const existing = await userRepo.findOneBy({ username: "admin" });
      if (!existing) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const adminUser = userRepo.create({
          username: "admin",
          password: hashedPassword,
          isAdmin: true,
        });
        await userRepo.save(adminUser);
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
