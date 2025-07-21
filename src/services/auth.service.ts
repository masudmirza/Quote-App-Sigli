import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { DbContext } from "../database/db-context";
import { BadRequestError, CustomError } from "../utils/errors";
import { config } from "../config";
import {
  SigninRequest,
  SigninResponse,
  SigninResponseDto,
  SignupRequest,
  SignupResponse,
  SignupResponseDto,
} from "../dtos/auth.dto";

@Service()
export class AuthService {
  constructor(private readonly dbContext: DbContext) {}

  async signup({ username, password }: SignupRequest): Promise<SignupResponse> {
    try {
      const exists = await this.dbContext.users.findOneBy({ username });
      if (exists) throw new BadRequestError("Username already taken");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.dbContext.users.create({ username, password: hashedPassword });
      await this.dbContext.users.save(user);

      return SignupResponseDto.parse(user);
    } catch (error: any) {
      console.log("error ", error);

      throw new CustomError(error.statusCode || 500, error.errorCode);
    }
  }

  async signin({ username, password }: SigninRequest): Promise<SigninResponse> {
    try {
      const user = await this.dbContext.users.findOneBy({ username });
      if (!user) throw new BadRequestError("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequestError("Invalid credentials");

      const token = this.generateToken({ userId: user.id, username: user.username });

      return SigninResponseDto.parse({ username: user.username, token });
    } catch (error: any) {
      throw new CustomError(error.statusCode || 500, error.errorCode);
    }
  }

  private generateToken({ userId, username }: { userId: string; username: string }) {
    return jwt.sign({ userId, username }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
  }
}
