import { DataSource, QueryRunner, Repository } from "typeorm";
import { UserService } from "../user.service";
import { DbContext } from "../../database/db-context";
import { CatalogItem } from "../../enums/catalog-item.enum";
import { BadRequestError, NotFoundError } from "../../utils/errors";

describe("UserService", () => {
  let service: UserService;
  let dbContext: DbContext;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let userRepo: jest.Mocked<Repository<any>>;
  let catalogRepo: jest.Mocked<Repository<any>>;

  beforeEach(() => {
    userRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    catalogRepo = {
      findOne: jest.fn(),
    } as any;

    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        getRepository: jest.fn((entity) => {
          if (entity === "UserEntity") return userRepo;
          if (entity === "CatalogItemEntity") return catalogRepo;
          return null;
        }),
      },
    } as unknown as QueryRunner;

    dataSource = {
      createQueryRunner: jest.fn(() => queryRunner),
    } as any;

    dbContext = {
      users: { target: "UserEntity" },
      catalogItems: { target: "CatalogItemEntity" },
    } as any;

    service = new UserService(dbContext, dataSource);
  });

  describe("selectMood", () => {
    it("should successfully select mood if not selected today", async () => {
      const user = {
        id: "user1",
        lastMoodSelectionAt: new Date("2023-01-01"),
        lastMoodSelection: null,
      };
      const mood = { id: "mood1", type: CatalogItem.MOOD };

      (userRepo.findOne as jest.Mock).mockResolvedValue(user);
      (catalogRepo.findOne as jest.Mock).mockResolvedValue(mood);
      (userRepo.save as jest.Mock).mockResolvedValue(user);
      (queryRunner.commitTransaction as jest.Mock).mockResolvedValue(undefined);

      const result = await service.selectMood("user1", "mood1");
      expect(result).toEqual({ success: true });
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ lastMoodSelection: mood }),
      );
    });

    it("should throw BadRequestError if mood already selected today", async () => {
      const now = new Date();
      const user = { id: "user1", lastMoodSelectionAt: now, lastMoodSelection: null };

      (userRepo.findOne as jest.Mock).mockResolvedValue(user);
      (catalogRepo.findOne as jest.Mock).mockResolvedValue({
        id: "mood1",
        type: CatalogItem.MOOD,
      });
      (queryRunner.rollbackTransaction as jest.Mock).mockResolvedValue(undefined);

      await expect(service.selectMood("user1", "mood1")).rejects.toThrow(BadRequestError);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it("should throw NotFoundError if user or mood not found", async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.selectMood("user1", "mood1")).rejects.toThrow(NotFoundError);

      (userRepo.findOne as jest.Mock).mockResolvedValue({
        id: "user1",
        lastMoodSelectionAt: null,
      });
      (catalogRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.selectMood("user1", "mood1")).rejects.toThrow(NotFoundError);
    });
  });
});
