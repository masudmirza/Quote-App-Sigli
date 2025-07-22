import { FastifyRequest, FastifyReply } from "fastify";
import { Service } from "typedi";
import { UnauthorizedError } from "../utils/errors";
import { UserService } from "../services/user.service";
import { CustomResponse } from "../utils/response";
import { handleError } from "../helpers/handle-error";

@Service()
export class UserController {
  constructor(private readonly userService: UserService) {}

  async selectMood(request: any, reply: any) {
    try {
      const userId = request.user.userId;
      const moodId = request.body.moodId;
      const result = await this.userService.selectMood(userId, moodId);
      return reply.status(200).send(CustomResponse(200, result));
    } catch (error: any) {
      handleError(error, reply);
    }
  }
}
