import { Controller, Res, UseGuards, Body, Post, Req } from "@nestjs/common";
import { verifyCpf, cleanCpf } from "../../functions/cpf";
import * as bcryptjs from "bcryptjs";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { LoginService } from "../../models/login/login.service";
import {
  AddLoginDto,
  UpdatePasswordDto,
} from "../../models/dtos/addLogin/add-login-body";
import { ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger";
import { verifyAndDecodeToken } from "src/functions/verifyExpiredToken";

@Controller("login")
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  @ApiCreatedResponse({ description: `Usuário criado com sucesso!` })
  @ApiBadRequestResponse({
    description:
      "É necessário os parâmetros de login, password, telefone, name e logradouro!",
  })
  @UseGuards(JwtAuthGuard)
  async createUser(
    @Body() addLoginDto: AddLoginDto,
    @Res() res: any
  ): Promise<void> {
    try {
      if (
        !addLoginDto.login ||
        !addLoginDto.password ||
        !addLoginDto.telefone ||
        !addLoginDto.name ||
        !addLoginDto.logradouro
      ) {
        return res.status(400).send({
          message:
            "É necessário os parâmetros de login, password, telefone, name e logradouro!",
        });
      }

      if (!verifyCpf(addLoginDto.login)) {
        return res.status(400).send({
          message: "CPF inválido!",
        });
      }

      const hashedPassword = await bcryptjs.hash(addLoginDto.password, 10);

      const verifyCPF = await this.loginService.findByLogin(
        cleanCpf(addLoginDto.login)
      );

      if (verifyCPF !== null) {
        return res.status(409).send({
          message: `CPF já cadastrado!`,
        });
      }

      if (addLoginDto.email) {
        const verifyEmail = await this.loginService.findByEmail(
          addLoginDto.email
        );

        if (verifyEmail !== null) {
          return res.status(409).send({
            message: `E-mail já cadastrado!`,
          });
        }
        await this.loginService.createLogin(addLoginDto, hashedPassword);
        return res.status(200).send({
          message: `Usuário ${addLoginDto.login} criado com sucesso!`,
        });
      } else {
        await this.loginService.createLogin(addLoginDto, hashedPassword);

        return res.status(200).send({
          message: `Usuário ${addLoginDto.login} criado com sucesso!`,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: `Usuário criado com sucesso!` })
  @ApiBadRequestResponse({
    description:
      "É necessário os parâmetros de login, password, telefone, name e logradouro!",
  })
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: any,
    @Req() req: any
  ): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      if (!updatePasswordDto.login || !updatePasswordDto.password) {
        return res.status(400).json({
          message: "É necessário os parâmetros de login e password!",
        });
      }

      const hashedPassword = await bcryptjs.hash(
        updatePasswordDto.password,
        10
      );

      await this.loginService.updatePassword(decoded.login, hashedPassword);

      res.status(200).json({
        message: "Senha do usuário " + updatePasswordDto.login + " alterada!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json("Não foi possível alterar a senha!" + err);
    }
  }
}
