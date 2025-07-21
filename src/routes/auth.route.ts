import { FastifyInstance } from "fastify";
import { Service } from "typedi";
import { AuthController } from "../controllers/auth.controller";

@Service()
export class AuthRoute {
  constructor(private readonly authController: AuthController) {
    console.log("AuthRoute initialized");
  }

  registerRoutes(app: FastifyInstance) {
    app.register(
      async (authApp) => {
        authApp.post("/signup", this.authController.signup.bind(this.authController));
        authApp.post("/signin", this.authController.signin.bind(this.authController));
      },
      { prefix: "/auth" },
    );
  }
}
