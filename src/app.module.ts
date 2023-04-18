import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoginModule } from "./login/login.module";
import { SigninModule } from "./signin/signin.module";
import { LoginController } from "./login/login.controller";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { TitulosController } from "./titulos/titulos.controller";
import { TitulosModule } from "./titulos/titulos.module";
import { TitulosAvencerController } from "./titulos-avencer/titulos-avencer.controller";
import { TitulosAvencerModule } from "./titulos-avencer/titulos-avencer.module";

@Module({
  imports: [
    SigninModule,
    LoginModule,
    AuthModule,
    TitulosModule,
    TitulosAvencerModule,
  ],
  controllers: [
    AppController,
    LoginController,
    TitulosController,
    TitulosAvencerController,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
