import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";
import { getAccessToken } from "../functions/key";

@Injectable()
export class VerifyAccessTokenMiddleware implements NestMiddleware {
  async use(request: FastifyRequest, response: FastifyReply, next: () => void) {
    const token = request.headers["x-access-token"];

    if (token != getAccessToken()) {
      return response.status(401).send();
    }
    (request as any).locals = { checked: true };
    next();
  }
}
