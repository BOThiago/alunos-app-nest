import { SigninModule } from "./signin/signin.module";
import { UserModule } from "./user/user.module";
import { UserService } from "./user/user.service";
import { AuthService } from "./auth/auth.service";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoginModule } from "./login/login.module";
import { LoginController } from "./login/login.controller";
import { PrismaService } from "./prisma/prisma.service";
import { TitulosController } from "./titulos/titulos.controller";
import { TitulosModule } from "./titulos/titulos.module";
import { TitulosAvencerController } from "./titulos-avencer/titulos-avencer.controller";
import { TitulosAvencerModule } from "./titulos-avencer/titulos-avencer.module";
import { AuthModule } from "./auth/auth.module";
import { SigninController } from "./signin/signin.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    SigninModule,
    UserModule,
    AuthModule,
    LoginModule,
    TitulosModule,
    TitulosAvencerModule,
  ],
  controllers: [
    AppController,
    LoginController,
    TitulosController,
    TitulosAvencerController,
    SigninController,
  ],
  providers: [UserService, AuthService, AppService, PrismaService, JwtService],
})
export class AppModule {}
