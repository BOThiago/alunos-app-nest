import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AddressModelController } from "./address-model.controller";

@Module({
  providers: [AddressModelController, PrismaService],
  exports: [AddressModelController, AddressModelController],
})
export class AddressModelModule {}
