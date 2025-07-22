import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { config } from "../config";
import { DbContext } from "../database/db-context";
import {
  SigninRequest,
  SigninResponse,
  SigninResponseDto,
  SignupRequest,
  SignupResponse,
  SignupResponseDto,
} from "../dtos/auth.dto";
import { BadRequestError, CustomError } from "../utils/errors";
import { DataSource } from "typeorm";

@Service()
export class AuthService {
  constructor(
    private readonly dbContext: DbContext,
    private readonly dataSource: DataSource,
  ) {}

  async signup({ username, password }: SignupRequest): Promise<SignupResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(this.dbContext.users.target);

      const exists = await userRepo.findOneBy({ username });
      if (exists) throw new BadRequestError("Username already taken");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepo.create({ username, password: hashedPassword });
      const savedUser = await userRepo.save(user);

      await queryRunner.commitTransaction();

      return SignupResponseDto.parse(savedUser);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new CustomError(error.statusCode || 500, error.errorCode);
    } finally {
      await queryRunner.release();
    }
  }

  async signin({ username, password }: SigninRequest): Promise<SigninResponse> {
    try {
      const user = await this.dbContext.users.findOneBy({ username });
      if (!user) throw new BadRequestError("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequestError("Invalid credentials");

      const token = this.generateToken({
        userId: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      });

      return SigninResponseDto.parse({ username: user.username, token });
    } catch (error: any) {
      throw new CustomError(error.statusCode || 500, error.errorCode);
    }
  }

  private generateToken({
    userId,
    username,
    isAdmin,
  }: {
    userId: string;
    username: string;
    isAdmin: boolean;
  }) {
    return jwt.sign({ userId, username, isAdmin }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
  }
}
