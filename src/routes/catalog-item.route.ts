import { FastifyInstance } from "fastify";
import { Service } from "typedi";
import { CatalogItemController } from "../controllers/catalog-item.controller";
import { isAdmin, isAuth } from "../middlewares/auth.middlewares";

@Service()
export class CatalogItemRoute {
  constructor(private readonly catalogItemController: CatalogItemController) {}

  registerRoutes(app: FastifyInstance) {
    app.register(
      async (catalogItemApp) => {
        catalogItemApp.addHook("onRequest", isAuth);
        catalogItemApp.addHook("onRequest", isAdmin);

        catalogItemApp.post(
          "/",
          this.catalogItemController.create.bind(this.catalogItemController),
        );
        catalogItemApp.put(
          "/:id",
          this.catalogItemController.update.bind(this.catalogItemController),
        );
        catalogItemApp.delete(
          "/:id",
          this.catalogItemController.delete.bind(this.catalogItemController),
        );
      },
      { prefix: "/catalog-items" },
    );
  }
}
