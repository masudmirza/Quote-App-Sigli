import { z } from "zod";

console.log("porrrt ", process.env.PORT);

const configSchema = z.object({
  HTTP_PORT: z.coerce.number().default(3000),
});

export const config = configSchema.parse(process.env);
