import { Module } from "@nestjs/common";
import { LoginService } from "./login.service";
import { PrismaService } from "../../database/prisma.service";

@Module({
  providers: [LoginService, PrismaService],
  exports: [LoginService, PrismaService],
})
export class UserModule {}
