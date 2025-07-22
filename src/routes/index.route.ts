import { FastifyInstance } from "fastify";
import { Service } from "typedi";
import { AuthRoute } from "./auth.route";
import { CatalogItemRoute } from "./catalog-item.route";

@Service()
export class AppRoutes {
  constructor(
    private readonly authRoute: AuthRoute,
    private readonly catalogItemRoute: CatalogItemRoute,
  ) {}

  registerAll(app: FastifyInstance) {
    app.register(
      async (v1App) => {
        this.authRoute.registerRoutes(v1App);
        this.catalogItemRoute.registerRoutes(v1App);
      },
      { prefix: "/api/v1" },
    );
  }
}
