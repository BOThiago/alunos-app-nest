import { Body, Controller, Put, Res, UseGuards, Param } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { LoginService } from "../../models/login/login.service";
import { Response } from "express";
import bcryptjs from "bcryptjs";

@Controller("recovery-pass")
export class RecoverPasswordController {
  constructor(private loginService: LoginService) {}

  @UseGuards(JwtAuthGuard)
  @Put(":token")
  async recoverPassword(
    @Body("password") password: string,
    @Param("token") token: string,
    @Res() res: Response
  ): Promise<any> {
    try {
      const user = this.loginService.findTokenRecover(token);

      if (!user) {
        return res.status(400).json({ error: "Token inválido ou expirado!" });
      }
      if (typeof password !== "string") {
        return res.status(400).json({ message: "Senha inválida!" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      await this.loginService.updatePasswordToken(token, hashedPassword);

      res.status(200).json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Não foi possível atualizar a senha!" });
    }
  }
}
