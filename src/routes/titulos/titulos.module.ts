import { Module } from "@nestjs/common";
import { AuthService } from "../../auth/auth.service";
import { PrismaService } from "../../database/prisma.service";
import { AuthModule } from "../../auth/auth.module";
import { LoginService } from "src/models/login/login.service";
import { TituloController } from "src/models/titulos/titulo.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [AuthModule, JwtModule],
  providers: [AuthService, PrismaService, LoginService, JwtService],
  controllers: [TituloController],
})
export class TitulosModule {}
