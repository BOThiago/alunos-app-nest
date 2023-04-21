import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { verifyAndDecodeToken } from "../../functions/verifyExpiredToken";
import { TituloController } from "../../models/titulos/titulo.controller";
import JSONbig from "json-bigint";

@Controller("pagos")
export class TitulosPagosController {
  constructor(private tituloController: TituloController) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async findPayTitulos(@Req() req: any, @Res() res: any): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      const findPayTitulos = await this.tituloController.findPayTitulos(
        decoded
      );

      if (findPayTitulos.length < 1) {
        return res
          .status(404)
          .json({ message: "Nenhum título pago encontrado!" });
      }

      return res.status(200).send(JSONbig.stringify({ pagos: findPayTitulos }));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar títulos pagos!" });
    }
  }
}
