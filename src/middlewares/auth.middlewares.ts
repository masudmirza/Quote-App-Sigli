import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { UnauthorizedError } from "../utils/errors";
import { ForbiddenError } from "apollo-server-fastify";

interface JwtPayload {
  userId: string;
  username: string;
  isAdmin?: boolean;
}

export function isAuth(request: FastifyRequest, reply: FastifyReply, done: () => void) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send(new UnauthorizedError("Missing or invalid token"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    (request as FastifyRequest & { user: JwtPayload }).user = decoded;
    done();
  } catch (err) {
    return reply.status(401).send(new UnauthorizedError("Invalid or expired token"));
  }
}

export function isAdmin(request: FastifyRequest, reply: FastifyReply, done: () => void) {
  if (!(request as FastifyRequest & { user: JwtPayload }).user?.isAdmin) {
    return reply.status(403).send(new ForbiddenError("Admin access required"));
  }

  done();
}
