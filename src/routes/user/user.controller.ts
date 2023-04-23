import {
  Controller,
  UseGuards,
  Get,
  Req,
  Res,
  Post,
  Put,
} from "@nestjs/common";
import { UserModelController } from "../../models/user/user-model.controller";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { verifyAndDecodeToken } from "../../functions/verifyExpiredToken";
import { SendTokenDto } from "src/models/dtos/user/user-send-token.body";
import { PrismaService } from "src/database/prisma.service";
import { EmailModelController } from "./../../models/emails/email-model.controller";
import { ChangeEmailDto } from "src/models/dtos/email/change-email.body";
import { AlterAddress } from "src/models/dtos/Address/address.body";
import { LoginService } from "src/models/login/login.service";
import { AddressModelController } from "src/models/address/address-model.controller";
const JSONbig = require("json-bigint");
const nodeCrypto = require("crypto");
const nodemailer = require("nodemailer");

@Controller("user")
export class UserController {
  constructor(
    private userModelController: UserModelController,
    private emailModelController: EmailModelController,
    private addressModelController: AddressModelController,
    private loginService: LoginService,
    private prisma: PrismaService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async findUser(@Req() req: any, @Res() res: any): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      const findUser = await this.userModelController.findUser(decoded);

      return res.status(200).send(JSONbig.stringify({ usuario: findUser }));
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Ocorreu um erro ao buscar os dados do usuário",
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("/envia-token")
  async sendToken(
    @Req() req: any,
    @Res() res: any,
    sendTokenDto: SendTokenDto
  ): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      if (!sendTokenDto.email) {
        return res.status(404).json({
          error: "é necessário fornecer um e-mail para continuar.",
        });
      }

      const user = await this.prisma.login.findUnique({
        where: {
          guid: decoded.guid,
        },
        include: {
          pessoas: {
            include: {
              emails: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "Ocorreu um erro no seu usuário.",
        });
      }

      // gera um token de confirmar email
      const tokenUser = nodeCrypto.randomBytes(4).toString("hex");
      const expiracao = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas a partir de agora

      if (!user) {
        const newPerson = await this.userModelController.newPerson(
          user,
          expiracao,
          tokenUser
        );
        await this.userModelController.updatePerson(decoded, newPerson);
      } else {
        const pessoa = user.pessoas.emails;
        if (!pessoa || pessoa.length === 0) {
          await this.emailModelController.newEmail(user, tokenUser, expiracao);
        } else {
          const emailExistente = pessoa[0];
          await this.emailModelController.updateToken(
            tokenUser,
            emailExistente,
            expiracao
          );
        }
      }

      // envia um e-mail com o token de confirmação de email
      const transporter = nodemailer.createTransport({
        host: process.env.HOST_NAME,
        port: process.env.HOST_PORT,
        secure: false,
        auth: {
          user: process.env.USER_NAME,
          pass: process.env.USER_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.FROM_MAIL,
        to: sendTokenDto.email,
        subject: "Confirmação de e-mail",
        text: `Olá, tudo bem? Foi solicitada a confirmação do seu e-mail. Para concluir o processo, por favor, copie o token abaixo e cole no site. É importante lembrar que este token tem validade de 24 horas.
      TOKEN: ${token}import { changeEmailDto } from './../../models/dtos/email/change-email.body';

      Qualquer dúvida, estamos à disposição para ajudar. Obrigado!`,
      };

      transporter.sendMail(mailOptions, function (error: string, info: any) {
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
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao processar a solicitação." });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("/troca-email")
  async changeEmail(
    @Req() req: any,
    @Res() res: any,
    changeEmailDto: ChangeEmailDto
  ): Promise<void> {
    try {
      const user = await this.emailModelController.findEmails(changeEmailDto);

      if (!user) {
        return res.status(400).json({ error: "Token inválido ou expirado." });
      }
      if (typeof changeEmailDto.email !== "string") {
        return res.status(400).json({ message: "Email inválido!" });
      }

      // atualiza o e-mail do usuário
      await this.emailModelController.updateEmail(changeEmailDto);

      res
        .status(200)
        .json({ message: "Seu e-mail foi atualizado com sucesso." });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao processar a solicitação." });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("/altera-endereco")
  async AlterAddress(
    @Req() req: any,
    @Res() res: any,
    alterAddress: AlterAddress
  ): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      if (
        !alterAddress.cep ||
        !alterAddress.logradouro ||
        !alterAddress.bairro ||
        !alterAddress.cidade ||
        !alterAddress.uf
      ) {
        return res.status(400).json({
          message: "Confira se os campos obrigatórios estão preenchidos.",
        });
      }

      const findUser = await this.prisma.login.findUnique({
        where: {
          guid: decoded.guid,
        },
        include: {
          pessoas: {
            include: {
              enderecos: true,
            },
          },
        },
      });

      if (!findUser) {
        return res.status(400).json({ message: "Usuário não encontrado!" });
      }

      if (!findUser.pessoas) {
        const newPerson = await this.userModelController.newPersonAddress(
          findUser,
          alterAddress
        );

        await this.userModelController.updatePerson(decoded, newPerson);
      } else {
        const pessoa = findUser.pessoas.enderecos;
        if (!pessoa || pessoa.length === 0) {
          await this.addressModelController.newEmail(alterAddress, findUser);
        } else {
          const enderecoExistente = pessoa[0];
          await this.addressModelController.AlterAddress(
            enderecoExistente,
            alterAddress
          );
        }
      }
      return res
        .status(200)
        .json({ message: "Endereço atualizado com sucesso!" });
    } catch (err) {
      return res.status(500).json({
        error: "Ocorreu um erro ao processar a alteração de endereço.",
      });
    }
  }
}
