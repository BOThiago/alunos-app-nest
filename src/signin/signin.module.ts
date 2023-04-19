import { Module } from "@nestjs/common";
import { SigninController } from "./signin.controller";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [SigninController],
  providers: [AuthService, PrismaService, UserService, JwtService],
  exports: [UserService],
})
export class SigninModule {}
