import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { TitulosController } from "./titulos.controller";
import { PrismaService } from "../prisma/prisma.service";
import { VerifyAccessTokenMiddleware } from "../middlewares/verifyAccessToken.middleware";

@Module({
  providers: [AuthService, PrismaService],
  controllers: [TitulosController],
})
export class TitulosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyAccessTokenMiddleware).forRoutes(TitulosController);
  }
}
