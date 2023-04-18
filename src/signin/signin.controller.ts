import {
  Controller,
  Put,
  UseInterceptors,
  Req,
  Res,
  BadRequestException,
  HttpStatus,
} from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaService } from "../prisma/prisma.service";
import { verifyCpf, cleanCpf } from "../functions/cpf";
import { VerifyAccessTokenMiddleware } from "../middlewares/verifyAccessToken.middleware";
import * as bcryptjs from "bcryptjs";

@Controller("signin")
export class SigninController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @UseInterceptors(VerifyAccessTokenMiddleware)
  async createUser(
    @Req()
    req: FastifyRequest<{
      Body: {
        login: string;
        password: string;
        email: string;
        ies: string;
        message: string;
        name: string;
      };
    }>,
    @Res() res: FastifyReply
  ): Promise<void> {
    try {
      const { login, password, email, ies, message, name } = req.body;

      if (!login || !password) {
        throw new BadRequestException(
          "É necessário os parâmetros de login e senha!"
        );
      }

      if (!verifyCpf(login)) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
          message: "CPF inválido!",
        });
        return;
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      await this.prisma.login.create({
        data: {
          login: cleanCpf(login),
          password: hashedPassword,
          change_password: true,
          email,
          ies,
          message: message || "",
          name,
        },
      });

      res.status(HttpStatus.OK).send({
        message: `Usuário ${email} criado com sucesso!`,
      });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Não foi possível criar o usuário!",
      });
    }
  }
}
