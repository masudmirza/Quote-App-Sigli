import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const configSchema = z.object({
  HTTP_PORT: z.coerce.number().default(3000),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USERNAME: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DATABASE: z.string().min(1),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(10),
  QUOTE_API_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development")
});

export const config = configSchema.parse(process.env);
