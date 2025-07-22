import jwt from "jsonwebtoken";
import { FastifyReply } from "fastify";
import { isAuth } from "../auth.middlewares";

jest.mock("jsonwebtoken");

describe("isAuth middleware", () => {
  const reply = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as FastifyReply;

  it("should reject if no token", () => {
    const req: any = { headers: {} };
    const done = jest.fn();
    isAuth(req, reply, done);
    expect(reply.status).toHaveBeenCalledWith(401);
  });

  it("should decode token and set user", () => {
    const user = { userId: "1", username: "john" };
    (jwt.verify as jest.Mock).mockReturnValue(user);
    const req: any = { headers: { authorization: "Bearer token" } };
    const done = jest.fn();

    isAuth(req, reply, done);
    expect(req.user).toEqual(user);
    expect(done).toHaveBeenCalled();
  });
});
