import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { TitulosController } from "./titulos.controller";
import { PrismaService } from "../prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";
import { UserService } from "src/user/user.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [AuthModule, JwtModule],
  providers: [AuthService, PrismaService, UserService, JwtService],
  controllers: [TitulosController],
})
export class TitulosModule {}
