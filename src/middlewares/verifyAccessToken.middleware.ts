import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { getAccessToken } from "../functions/key";

@Injectable()
export class VerifyAccessTokenMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: NextFunction) {
    const token = request.headers["x-access-token"];

    if (token !== getAccessToken()) {
      return response.status(401).send();
    }
    (request as any).locals = { checked: true };
    next();
  }
}
