import { Module } from "@nestjs/common";
import { LoginController } from "./login.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [LoginController],
  providers: [PrismaService],
})
export class LoginModule {}
