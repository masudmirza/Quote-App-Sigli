import "reflect-metadata";
import accepts from "@fastify/accepts";
import Fastify from "fastify";
import Container from "typedi";
import { DataSource as TypeOrmDataSource } from "typeorm";
import { config } from "./config";
import { AppDataSource } from "./database/connection";
import { SeederService } from "./database/services/seeder.service";
import { AppRoutes } from "./routes/index.route";
import { logger } from "./utils/logger";
import { ApolloServer } from "@apollo/server";
import { fastifyApolloHandler } from "@as-integrations/fastify";
import { CatalogItemResolver } from "./graphql/resolvers/catalog-item.resolver";
import { buildSchema } from "type-graphql";
import cors from "@fastify/cors";
import { QuoteResolver } from "./graphql/resolvers/quote.resolver";
import { UserResolver } from "./graphql/resolvers/user.resolver";

export async function bootstrap() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  });
  app.register(accepts);

  let isShuttingDown = false;

  try {
    await AppDataSource.initialize();

    Container.set(TypeOrmDataSource, AppDataSource);
    const seederService = Container.get(SeederService);
    await seederService.runAll();
  } catch (err) {
    logger.error({ err }, "Failed to connect to database");
    process.exit(1);
  }

  app.get("/health", async (request, reply) => {
    return { status: "healthy", timestamp: new Date().toISOString() };
  });

  const appRoutes = Container.get(AppRoutes);
  appRoutes.registerAll(app);

  const schema = await buildSchema({
    resolvers: [CatalogItemResolver, QuoteResolver, UserResolver],
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    introspection: true,
  });

  await server.start().then(() => {
    logger.info(
      `🚀 Apollo Server started on http://0.0.0.0:${config.HTTP_PORT}/graphql`,
    );
  });

  app.route({
    method: ["GET", "POST", "OPTIONS"],
    url: "/graphql",
    handler: fastifyApolloHandler(server, {
      context: async (req, reply) => ({ request: req, reply }),
    }),
  });

  const closeGracefully = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`${signal} received: closing app gracefully`);

    try {
      await app.close();
      logger.info("Fastify HTTP server closed");

      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info("PostgreSQL connection closed");
      }

      process.exit(0);
    } catch (err) {
      logger.error({ err }, "Error during shutdown");
      process.exit(1);
    }
  };

  process.on("SIGINT", closeGracefully);
  process.on("SIGTERM", closeGracefully);
  process.on("uncaughtException", (err) => {
    logger.error({ err }, "Uncaught exception");
    closeGracefully("uncaughtException");
  });
  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled rejection");
    closeGracefully("unhandledRejection");
  });

  try {
    await app.listen({ host: "0.0.0.0", port: config.HTTP_PORT });
    logger.info(`🚀 Server listening on http://0.0.0.0:${config.HTTP_PORT}`);
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
}
