import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "../auth.service";
import { DbContext } from "../../database/db-context";
import { DataSource } from "typeorm";
import { BadRequestError, CustomError } from "../../utils/errors";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockUserRepo = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    getRepository: jest.fn().mockReturnValue(mockUserRepo),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
} as unknown as DataSource;

const mockDbContext = {
  users: {
    findOneBy: jest.fn(),
  },
} as unknown as DbContext;

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(mockDbContext, mockDataSource);
  });

  describe("signup", () => {
    it("should throw CustomError if username exists", async () => {
      mockUserRepo.findOneBy.mockResolvedValue({ id: "1" });

      await expect(
        service.signup({ username: "exists", password: "pass" }),
      ).rejects.toBeInstanceOf(CustomError);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it("should rollback and throw CustomError on db failure", async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      mockUserRepo.create.mockReturnValue({ username: "fail", password: "hashed" });
      mockUserRepo.save.mockRejectedValue(new Error("DB error"));

      await expect(
        service.signup({ username: "fail", password: "pass" }),
      ).rejects.toBeInstanceOf(CustomError);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it("should hash password, create and save user, then commit transaction", async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      mockUserRepo.create.mockReturnValue({
        username: "newuser",
        password: "hashedpass",
      });
      mockUserRepo.save.mockResolvedValue({
        id: "1",
        username: "newuser",
        isAdmin: false,
        createdAt: new Date(),
        password: "hashedpass",
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");

      const result = await service.signup({ username: "newuser", password: "plainpass" });

      expect(result).toEqual(
        expect.objectContaining({
          id: "1",
          username: "newuser",
          isAdmin: false,
        }),
      );
    });
  });

  describe("signin", () => {
    it("should throw CustomError if user not found", async () => {
      (mockDbContext.users.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(
        service.signin({ username: "nouser", password: "pass" }),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("should throw CustomError if password does not match", async () => {
      (mockDbContext.users.findOneBy as jest.Mock).mockResolvedValue({
        password: "hashedpass",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.signin({ username: "user", password: "wrongpass" }),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("should return token and username on successful signin", async () => {
      const user = { id: "1", username: "user", password: "hashedpass", isAdmin: true };
      (mockDbContext.users.findOneBy as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const result = await service.signin({ username: "user", password: "correct" });

      expect(bcrypt.compare).toHaveBeenCalledWith("correct", "hashedpass");
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "1", username: "user", isAdmin: true },
        expect.any(String),
        { expiresIn: "7d" },
      );
      expect(result).toEqual({ username: "user", token: "token" });
    });

    it("should throw CustomError on unexpected error", async () => {
      (mockDbContext.users.findOneBy as jest.Mock).mockRejectedValue(
        new Error("DB failure"),
      );

      await expect(
        service.signin({ username: "fail", password: "pass" }),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });
});
