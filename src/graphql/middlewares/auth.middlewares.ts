import { MiddlewareFn } from "type-graphql";
import { FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { ForbiddenError, AuthenticationError } from "apollo-server-errors";

interface JwtPayload {
  userId: string;
  username: string;
  isAdmin?: boolean;
}

export interface MyContext {
  request: FastifyRequest & { user?: JwtPayload };
}

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authHeader = context.request?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("Missing or invalid token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    context.request.user = decoded;
  } catch {
    throw new AuthenticationError("Invalid or expired token");
  }

  return next();
};

export const isAdmin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.request?.user?.isAdmin) {
    throw new ForbiddenError("Admin access required");
  }
  return next();
};
