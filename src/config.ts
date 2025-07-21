import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const configSchema = z.object({
  HTTP_PORT: z.coerce.number().default(3000),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().default(6379),
  DATABASE_URL: z.string(),
});

export const config = configSchema.parse(process.env);
