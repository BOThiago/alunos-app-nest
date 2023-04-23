import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { verifyAndDecodeToken } from "../../functions/verifyExpiredToken";
import { TituloController } from "../../models/titulos/titulo.controller";
import JSONbig from "json-bigint";

@Controller("vencidos")
export class TitulosVencidosController {
  constructor(private tituloController: TituloController) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async findPayTitulos(@Req() req: any, @Res() res: any): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      const findTitle = await this.tituloController.findTitulosVencidos(
        decoded.login
      );

      if (findTitle.length > 0) {
        return res.status(200).send(JSONbig.stringify({ vencidos: findTitle }));
      } else {
        return res
          .status(404)
          .json({ message: "Não possui títulos vencidos!" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Ocorreu um erro interno." });
    }
  }
}
