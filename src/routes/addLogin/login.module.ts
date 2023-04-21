import { Module } from "@nestjs/common";
import { LoginController } from "./login.controller";
import { PrismaService } from "../../database/prisma.service";

@Module({
  controllers: [LoginController],
  providers: [PrismaService],
})
export class LoginModule {}
