import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { verifyAndDecodeToken } from "../../functions/verifyExpiredToken";
import { LoginService } from "../../models/login/login.service";
import bcryptjs from "bcryptjs";

@Controller("/password")
export class PasswordController {
  TituloController: any;
  constructor(private loginService: LoginService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/")
  async changePassword(@Req() req: any, @Res() res: any): Promise<void> {
    const token = String(req.headers["x-access-token"]);
    const decoded = verifyAndDecodeToken(token, res);

    const { newPassword } = req.body;

    if (typeof newPassword !== "string") {
      return res.status(400).json({ message: "Senha inválida!" });
    }

    if (!newPassword) {
      res.status(400).json({
        message: "Nova senha não foi preenchida!",
      });
    }

    const verifyLogin = this.loginService.findByLogin(decoded.login);

    if (!verifyLogin) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await this.loginService.updatePassword(decoded, hashedPassword);

    res.status(200).json({ message: "Senha atualizada com sucesso!" });
  }
}
