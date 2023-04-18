import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SigninModule } from "./signin/signin.module";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [SigninModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
