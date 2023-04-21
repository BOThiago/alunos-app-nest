import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Put,
  Req,
  Res,
  BadRequestException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { verifyCpf, cleanCpf } from "../../functions/cpf";
import * as bcryptjs from "bcryptjs";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller("login")
export class LoginController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async createUser(
    @Req() req: Request,
    @Res() res: Response,
    next: NextFunction
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
      next(err);
    }
  }
}
