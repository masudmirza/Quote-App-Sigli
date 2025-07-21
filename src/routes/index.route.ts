import { FastifyInstance } from "fastify";
import { Service } from "typedi";
import { AuthRoute } from "./auth.route";

@Service()
export class AppRoutes {
  constructor(private readonly authRoute: AuthRoute) {
    console.log("index route");
  }

  registerAll(app: FastifyInstance) {
    app.register(
      async (v1App) => {
        this.authRoute.registerRoutes(v1App);
      },
      { prefix: "/api/v1" },
    );
  }
}
