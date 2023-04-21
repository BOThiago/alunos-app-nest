import { Module } from "@nestjs/common";
import { SigninController } from "./signin.controller";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "../../database/prisma.service";
import { LoginService } from "src/models/login/login.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [SigninController],
  providers: [AuthService, PrismaService, LoginService, JwtService],
  exports: [LoginService],
})
export class SigninModule {}
