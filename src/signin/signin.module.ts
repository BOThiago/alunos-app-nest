import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SigninController } from "./signin.controller";
import { PrismaService } from "../prisma/prisma.service";
import { VerifyAccessTokenMiddleware } from "./../middlewares/verifyAccessToken.middleware";

@Module({
  controllers: [SigninController],
  providers: [PrismaService],
})
export class SigninModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyAccessTokenMiddleware).forRoutes(SigninController);
  }
}
