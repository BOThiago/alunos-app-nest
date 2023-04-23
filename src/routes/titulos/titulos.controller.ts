import {
  Controller,
  Get,
  Post,
  Put,
  Res,
  Req,
  HttpStatus,
  Body,
  UseGuards,
  InternalServerErrorException,
  Param,
} from "@nestjs/common";
import {
  CreateTituloDto,
  CreateTituloDtoEc,
} from "../../models/dtos/titulos/create-titulos-body";
import { AuthService } from "../../auth/auth.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { removeEmpty } from "../../functions/removeEmpty";
import JSONbig from "json-bigint";
import { verifyAndDecodeToken } from "../../functions/verifyExpiredToken";
import { TituloController } from "../../models/titulos/titulo.controller";
import { LoginService } from "./../../models/login/login.service";
import { updateTituloDto } from "../../models/dtos/titulos/update-titulos-body";

@Controller("titulos")
export class TitulosController {
  constructor(
    private tituloController: TituloController,
    private loginService: LoginService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async findManyTitulos(@Req() req: any, @Res() res: any): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      console.log(decoded);

      const findTitle = await this.tituloController.findTitulos(decoded);

      if (findTitle.length < 1) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: "Nenhum título encontrado!",
        });
      } else {
        res
          .status(HttpStatus.OK)
          .send(JSONbig.stringify({ titulos: findTitle }));
      }
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Ocorreu um erro ao buscar os títulos.",
      });
    }
  }

  @UseGuards(AuthService)
  @Post("/")
  async createTitulo(
    @Body() createTituloDto: CreateTituloDto,
    @Req() req: any,
    @Res() res: any
  ) {
    try {
      const token = String(req.headers["x-access-token"]);
      verifyAndDecodeToken(token, res);

      const verifyUser = await this.loginService.findByID(
        Number(createTituloDto.login_id)
      );

      if (verifyUser === null) {
        return res.json({ message: "Usuário não encontrado!" }).status(432);
      }

      const verifyEC = await this.tituloController.verifyEC(createTituloDto);

      if (verifyEC[0] !== null) {
        return res.status(409).json({
          message: "External code já existente!",
        });
      } else {
        await this.tituloController.createTitulos(createTituloDto);

        return res.status(200).json({
          message: "Título adicionado com sucesso!",
        });
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        "Não foi possível adicionar o título!"
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("/")
  async updateTitulos(
    @Body() updateTituloDto: updateTituloDto,
    @Res() res: any,
    @Req() req: any
  ): Promise<void> {
    try {
      const token = String(req.headers["x-access-token"]);
      verifyAndDecodeToken(token, res);

      if (!updateTituloDto.external_code) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Falta preencher os campos obrigatórios!",
        });
      }
      const verifyTitulo = await this.tituloController.verifyTituloEC(
        updateTituloDto
      );

      if (!verifyTitulo) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: "Título não encontrado!",
        });
      } else {
        await this.tituloController.updateTituloEC(updateTituloDto);

        res.status(HttpStatus.OK).json({
          message: "Título alterado com sucesso!",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Ocorreu um erro ao atualizar o título!",
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("/destaque")
  async getDestaque(@Req() req: any, @Res() res: any) {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      const expiredTitle = await this.tituloController.expiredTitulo(
        decoded.login
      );

      if (expiredTitle.length > 0) {
        return res
          .status(200)
          .send(JSONbig.stringify({ destaque: expiredTitle }));
      }

      if (expiredTitle.length < 1) {
        const expiringTitle = await this.tituloController.expiringTitulo(
          decoded.login
        );

        if (expiringTitle.length > 0) {
          return res
            .status(200)
            .send(JSONbig.stringify({ destaque: expiringTitle }));
        } else {
          return res.status(404).json({ message: "Nenhum título encontrado!" });
        }
      } else {
        !expiredTitle;
        return res.status(404).json({ message: "Nenhum título encontrado!" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro ao buscar os títulos.",
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getTituloById(
    @Req() req: any,
    @Res() res: any,
    @Param("id") id: string
  ) {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);
      const findTitle = await this.tituloController.findTitulo(
        decoded.login,
        id
      );

      if (!findTitle) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Título não encontrado!" });
      }

      return res
        .status(HttpStatus.OK)
        .send(JSONbig.stringify({ titulo: findTitle }));
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Ocorreu um erro ao buscar o título.",
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("/relaxed")
  async updateTitulo(
    @Req() req: any,
    @Res() res: any,
    @Body() createTituloDtoEc: CreateTituloDtoEc
  ) {
    try {
      const token = String(req.headers["x-access-token"]);
      const decoded = verifyAndDecodeToken(token, res);

      if (!createTituloDtoEc.external_code) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          erro: HttpStatus.BAD_REQUEST,
          message: "Falta preencher campos obrigatórios",
        });
      }

      const data = removeEmpty(createTituloDtoEc);
      let titulo = await this.tituloController.findTituloEc(createTituloDtoEc);

      if (titulo) {
        await this.tituloController.updateTituloRelaxed(createTituloDtoEc);
        return res.status(HttpStatus.OK).json({
          external_code: createTituloDtoEc[10],
          message: "Título alterado com sucesso!",
        });
      }

      // Handle relaxed update when external_code is not found
      const login = await this.tituloController.findFirstCic(createTituloDtoEc);

      if (!login) {
        return res.status(HttpStatus.NOT_FOUND).json({
          erro: HttpStatus.NOT_FOUND,
          external_code: createTituloDtoEc[10],
          cic: createTituloDtoEc[9],
          mensagem: "Aluno não encontrado",
        });
      }

      titulo = await this.tituloController.findTitulosExpired(
        createTituloDtoEc,
        decoded.login
      );

      if (!titulo) {
        return res.status(HttpStatus.NOT_FOUND).json({
          erro: HttpStatus.NOT_FOUND,
          external_code: createTituloDtoEc[10],
          cic: createTituloDtoEc[9],
          data_vencimento: createTituloDtoEc[1],
          mensagem: "Titulo não encontrado",
        });
      }

      await this.tituloController.updateTituloBogus(titulo, data);

      return res.status(HttpStatus.OK).json({
        external_code: createTituloDtoEc[10],
        real_external_code: titulo.external_code,
        cic: createTituloDtoEc[9],
        data_vencimento: createTituloDtoEc[1],
        message: "Título alterado com sucesso!",
      });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        external_code: createTituloDtoEc[10],
        error: err,
      });
    }
  }
}
