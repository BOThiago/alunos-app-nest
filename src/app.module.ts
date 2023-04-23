import { AddressModelModule } from "./models/address/address-model.module";
import { AddressModelController } from "./models/address/address-model.controller";
import { EmailModelModule } from "./models/emails/email-model.module";
import { EmailModelController } from "./models/emails/email-model.controller";
import { UserModelModule } from "./models/user/user-model.module";
import { UserModelController } from "./models/user/user-model.controller";
import { UserModule } from "./routes/user/user.module";
import { SendEmailModule } from "./routes/sendEmail/send-email.module";
import { SendEmailController } from "./routes/sendEmail/send-email.controller";
import { RecoverPasswordModule } from "./routes/recoverPassword/recover-password.module";
import { RecoverPasswordController } from "./routes/recoverPassword/recover-password.controller";
import { PasswordModule } from "./routes/password/password.module";
import { PasswordController } from "./routes/password/password.controller";
import { BotModule } from "./routes/bot/bot.module";
import { BotController } from "./routes/bot/bot.controller";
import { TitulosVencidosModule } from "./routes/titulos-vencidos/titulos-vencidos.module";
import { TitulosVencidosController } from "./routes/titulos-vencidos/titulos-vencidos.controller";
import { TitulosPagosModule } from "./routes/titulos-pagos/titulos-pagos.module";
import { TitulosPagosController } from "./routes/titulos-pagos/titulos-pagos.controller";
import { SigninModule } from "./routes/signin/signin.module";
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
import { UserController } from "./routes/user/user.controller";

@Module({
  imports: [
    AddressModelModule,
    EmailModelModule,
    UserModelModule,
    SendEmailModule,
    RecoverPasswordModule,
    PasswordModule,
    BotModule,
    TitulosVencidosModule,
    TitulosPagosModule,
    SigninModule,
    UserModule,
    AuthModule,
    LoginModule,
    TitulosModule,
    TitulosAvencerModule,
    TituloModule,
  ],
  controllers: [
    AddressModelController,
    EmailModelController,
    UserController,
    UserModelController,
    SendEmailController,
    RecoverPasswordController,
    PasswordController,
    BotController,
    TitulosVencidosController,
    TitulosPagosController,
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
