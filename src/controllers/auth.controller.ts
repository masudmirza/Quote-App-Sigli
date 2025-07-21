import { Service } from "typedi";
import { SigninRequestDto, SignupRequestDto } from "../dtos/auth.dto";
import { handleError } from "../helpers/handle-error";
import { AuthService } from "../services/auth.service";
import { CustomResponse } from "../utils/response";

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signup(request: any, reply: any) {
    try {
      const input = SignupRequestDto.parse(request.body);
      const result = await this.authService.signup(input);
      return reply.status(201).send(CustomResponse(201, result));
    } catch (error: any) {
      handleError(error, reply);
    }
  }

  async signin(request: any, reply: any) {
    try {
      const input = SigninRequestDto.parse(request.body);
      const result = await this.authService.signin(input);
      return reply.status(200).send(CustomResponse(200, result));
    } catch (error: any) {
      handleError(error, reply);
    }
  }
}
