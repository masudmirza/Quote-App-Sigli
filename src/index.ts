import Fastify from "fastify";
import { config } from "./config";

const app = Fastify({ logger: true });

app.get("/", async (request, reply) => {
  return { message: "Hello Fastify + TypeScript!" };
});

const start = async () => {
  try {
    await app.listen({ port: config.HTTP_PORT });
    console.log(`Server listening on http://127.0.0.1:${config.HTTP_PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
