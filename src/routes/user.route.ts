import { FastifyInstance } from "fastify";
import { Service } from "typedi";
import { UserController } from "../controllers/user.controller";
import { isAuth } from "../middlewares/auth.middlewares";

@Service()
export class UserRoute {
  constructor(private readonly userController: UserController) {}

  registerRoutes(app: FastifyInstance) {
    app.register(
      async (userApp) => {
        userApp.addHook("onRequest", isAuth);

        userApp.put(
          "/mood/select",
          this.userController.selectMood.bind(this.userController),
        );
      },
      { prefix: "/users" },
    );
  }
}
