import { bootstrap } from "./bootstrap";
import { logger } from "./utils/logger";

bootstrap().catch((err) => {
  logger.error("Failed to start application", err);
  process.exit(1);
});
