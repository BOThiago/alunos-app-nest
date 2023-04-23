import { Module } from "@nestjs/common";
import { EmailModelController } from "./email-model.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  providers: [EmailModelController, PrismaService],
  exports: [EmailModelController, EmailModelController],
})
export class EmailModelModule {}
