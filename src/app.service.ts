import { Injectable, NestMiddleware } from "@nestjs/common";
import { getPort } from "./functions/port";
import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express";
import { verifyAndDecodeToken } from "./functions/verifyExpiredToken";

@Injectable()
export class AppService {
  getHello(): string {
    return `API Runing on port ${getPort()}!`;
  }
}

// @Injectable()
// export class AdminMiddleware implements NestMiddleware {
//   constructor(private readonly prisma: PrismaClient) {}

//   async use(req: Request, res: any, next: NextFunction) {
//     const token = String(req.headers["x-access-token"]);
//     const decoded = verifyAndDecodeToken(token, res);

//     const userAdmin = await this.prisma.login.findUnique({ where: { login: decoded.login } });
//     if (userAdmin && userAdmin.profile === 'admin') {
//       next();
//     } else {
//       res.status(401).json({ message: 'Unauthorized' });
//     }
//   }
// }
