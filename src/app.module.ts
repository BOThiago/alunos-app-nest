import { SigninModule } from "./routes/signin/signin.module";
import { UserModule } from "./models/login/login.module";
import { LoginService } from "./models/login/login.service";
import { AuthService } from "./auth/auth.service";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoginModule } from "./routes/addLogin/login.module";
import { LoginController } from "./routes/addLogin/login.controller";
import { PrismaService } from "./database/prisma.service";
import { TitulosController } from "./routes/titulos/titulos.controller";
import { TitulosModule } from "./routes/titulos/titulos.module";
import { TitulosAvencerController } from "./routes/titulos-avencer/titulos-avencer.controller";
import { TitulosAvencerModule } from "./routes/titulos-avencer/titulos-avencer.module";
import { AuthModule } from "./auth/auth.module";
import { SigninController } from "./routes/signin/signin.controller";
import { JwtService } from "@nestjs/jwt";
import { TituloModule } from "./models/titulos/titulo.module";
import { TituloController } from "./models/titulos/titulo.controller";

@Module({
  imports: [
    SigninModule,
    UserModule,
    AuthModule,
    LoginModule,
    TitulosModule,
    TitulosAvencerModule,
    TituloModule,
  ],
  controllers: [
    AppController,
    LoginController,
    TitulosController,
    TitulosAvencerController,
    SigninController,
    TituloController,
  ],
  providers: [LoginService, AuthService, AppService, PrismaService, JwtService],
})
export class AppModule {}
