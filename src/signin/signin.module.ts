import { Module } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { SigninController } from "./signin.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [AuthService, PrismaService],
  controllers: [SigninController],
})
export class SigninModule {}
