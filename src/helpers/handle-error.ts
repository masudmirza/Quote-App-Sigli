import { ZodError } from "zod";

export function handleError(error: any, reply: any): void {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      message: error.issues.map((e) => e),
    });
  }

  return reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    message: error.errorCode,
  });
}
