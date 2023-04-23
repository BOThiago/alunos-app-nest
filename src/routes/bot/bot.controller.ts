import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { verifyAndDecodeToken } from "../../functions/verifyExpiredToken";
import { LoginService } from "../../models/login/login.service";
import { TituloController } from "../../models/titulos/titulo.controller";
import JSONbig from "json-bigint";

@Controller(":cic")
export class BotController {
  constructor(
    private loginService: LoginService,
    private tituloController: TituloController
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("proximo_titulo")
  async findPayTitulos(
    @Req() req: any,
    @Res() res: any,
    @Param("cic") cic: string
  ): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      verifyAndDecodeToken(token, res);

      const login = await this.loginService.findByCic(cic);

      if (!login) {
        return res.status(404).json({
          erro: 404,
          cic: cic,
          mensagem: "Aluno não encontrado",
        });
      }

      const titulo = await this.tituloController.findTitulosPendentes(cic);

      if (titulo.length < 1) {
        return res
          .status(404)
          .json({ cic: cic, message: "Titulo pendente não encontrado" });
      }

      return res.status(200).send(JSONbig.stringify({ títulos: titulo }));
    } catch {
      return res.status(500).json({
        mensagem: "Não foi possívels buscar títulos pendentes!",
      });
    }
  }
}
