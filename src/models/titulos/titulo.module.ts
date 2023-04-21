import { Module } from "@nestjs/common";
import { TituloController } from "./titulo.controller";
import { PrismaService } from "../../database/prisma.service";

@Module({
  providers: [TituloController, PrismaService],
  exports: [TituloController, TituloController],
})
export class TituloModule {}
