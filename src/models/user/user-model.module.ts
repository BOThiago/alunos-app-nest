import { Module } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UserModelController } from "./user-model.controller";

@Module({
  providers: [UserModelController, PrismaService],
  exports: [UserModelController, UserModelController],
})
export class UserModelModule {}
