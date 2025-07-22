import { FastifyInstance } from "fastify";
import { Service } from "typedi";
import { AuthRoute } from "./auth.route";
import { CatalogItemRoute } from "./catalog-item.route";
import { QuoteRoute } from "./quote.route";
import { UserRoute } from "./user.route";

@Service()
export class AppRoutes {
  constructor(
    private readonly authRoute: AuthRoute,
    private readonly catalogItemRoute: CatalogItemRoute,
    private readonly quoteRoute: QuoteRoute,
    private readonly userRoute: UserRoute,
  ) {}

  registerAll(app: FastifyInstance) {
    app.register(
      async (v1App) => {
        this.authRoute.registerRoutes(v1App);
        this.catalogItemRoute.registerRoutes(v1App);
        this.quoteRoute.registerRoutes(v1App);
        this.userRoute.registerRoutes(v1App);
      },
      { prefix: "/api/v1" },
    );
  }
}
