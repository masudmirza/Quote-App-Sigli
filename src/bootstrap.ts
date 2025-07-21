import "reflect-metadata";
import Fastify from "fastify";
import { config } from "./config";
import { DataSource as TypeOrmDataSource } from "typeorm";
import { AppDataSource } from "./database/connection";
import { logger } from "./utils/logger";
import { AppRoutes } from "./routes/index.route";
import Container from "typedi";

export async function bootstrap() {
  const app = Fastify({ logger: true });
  //   const redis = new Redis({
  //     host: config.REDIS_HOST,
  //     port: config.REDIS_PORT,
  //   });

  let isShuttingDown = false;

  // Register it to typedi

  try {
    await AppDataSource.initialize();
    Container.set(TypeOrmDataSource, AppDataSource);
    logger.info("PostgreSQL connected 🎉");
  } catch (err) {
    logger.error({ err }, "Failed to connect to database");
    process.exit(1);
  }

  const appRoutes = Container.get(AppRoutes);
  appRoutes.registerAll(app);

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

      //   await redis.quit();
      //   logger.info("Redis connection closed");

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
    await app.listen({ port: config.HTTP_PORT });
    logger.info(`🚀 Server listening on http://localhost:${config.HTTP_PORT}`);
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
}
