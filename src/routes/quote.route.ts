import { FastifyInstance } from "fastify";
import { Service } from "typedi";
import { QuoteController } from "../controllers/quote.controller";
import { isAuth } from "../middlewares/auth.middlewares";

@Service()
export class QuoteRoute {
  constructor(private readonly quoteController: QuoteController) {}

  registerRoutes(app: FastifyInstance) {
    app.register(
      async (quoteApp) => {
        quoteApp.addHook("onRequest", isAuth);

        quoteApp.get(
          "/random",
          this.quoteController.getRandomQuote.bind(this.quoteController),
        );
        quoteApp.put(
          "/like/:id",
          this.quoteController.toggleLike.bind(this.quoteController),
        );
      },
      { prefix: "/quotes" },
    );
  }
}
