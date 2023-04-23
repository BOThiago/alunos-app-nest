import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import nodeCrypto from "crypto";
import nodemailer from "nodemailer";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { LoginService } from "../../models/login/login.service";
import { sendEmailDto } from "../../models/dtos/email/send-email-body";
import { TransportOptions } from "nodemailer";

@Controller("/send-mail")
export class SendEmailController {
  constructor(private loginService: LoginService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/")
  async sendEmail(
    @Body() sendEmailDto: sendEmailDto,
    @Res() res: any
  ): Promise<void> {
    try {
      const user = await this.loginService.findByLogin(sendEmailDto.login);

      if (!user) {
        return res.status(404).json({
          error: `Foi enviado um e-mail para ${sendEmailDto.email}.`,
        });
      }

      const token = nodeCrypto.randomBytes(20).toString("hex");
      const expiracao = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas a partir de agora
      const userUpdated = await this.loginService.sendEmailToken(
        sendEmailDto,
        token,
        expiracao
      );

      // envia um e-mail com o link de redefinição de senha
      const transporter = nodemailer.createTransport({
        host: process.env.HOST_NAME,
        port: parseInt(process.env.HOST_PORT, 10),
        secure: false,
        auth: {
          user: process.env.USER_NAME,
          pass: process.env.USER_PASSWORD,
        },
      } as TransportOptions);

      const mailOptions = {
        from: process.env.FROM_MAIL,
        to: sendEmailDto.email,
        subject: "Redefinição de senha",
        text: `Olá ${userUpdated.name}, você solicitou a redefinição de senha. Clique no link abaixo para criar uma nova senha. Este link expirará em 24 horas.
        
            ${process.env.LINK_FRONT}/${token}`,
      };

      transporter.sendMail(
        mailOptions,
        function (error: Error | null, info: any) {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ error: "Ocorreu um erro ao enviar o e-mail." });
          } else {
            console.log("E-mail enviado: " + info.response);
            return res
              .status(200)
              .json({ message: "E-mail enviado com sucesso." });
          }
        }
      );
    } catch (error) {}
  }
}
