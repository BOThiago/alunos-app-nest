import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { verifyAndDecodeToken } from "../../functions/verifyExpiredToken";
import { TituloController } from "../../models/titulos/titulo.controller";
import JSONbig from "json-bigint";

@Controller("vencer")
export class TitulosAvencerController {
  constructor(private tituloController: TituloController) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async findTitulosAVencer(@Req() req: any, @Res() res: any): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      const findTitutlosAVencer =
        await this.tituloController.findTitutlosAVencer(decoded);

      if (findTitutlosAVencer.length > 0) {
        return res
          .send(JSONbig.stringify({ titulos_a_vencer: findTitutlosAVencer }))
          .status(200);
      } else {
        return res
          .json({ message: "Não possui títulos à vencer!" })
          .status(404);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro ao buscar os títulos.",
      });
    }
  }
}
