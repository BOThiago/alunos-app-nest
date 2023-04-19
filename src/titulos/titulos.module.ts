import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { TitulosController } from "./titulos.controller";
import { PrismaService } from "../prisma/prisma.service";
import { VerifyAccessTokenMiddleware } from "../middlewares/verifyAccessToken.middleware";
import { AuthModule } from "../auth/auth.module";
import { UserService } from "src/user/user.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [AuthModule],
  providers: [AuthService, PrismaService, UserService, JwtService],
  controllers: [TitulosController],
})
export class TitulosModule {}
// export class TitulosModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(VerifyAccessTokenMiddleware).forRoutes(TitulosController);
//   }
// }
