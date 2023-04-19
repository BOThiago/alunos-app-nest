import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  HttpStatus,
  Body,
  UseGuards,
  UseInterceptors,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "./../prisma/prisma.service";
import JSONbig from "json-bigint";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

export interface createTituloDto {
  valor: Number;
  data_vencimento: Date;
  boleto_codigo: string;
  boleto_url: string;
  curso: string;
  favorecido: string;
  login_id: Number;
  pix_codigo: string;
  pix_url: string;
  situacao: string;
  external_code: string;
}

@Controller("titulos")
export class TitulosController {
  constructor(private prisma: PrismaService) {}

  @Get("/")
  @UseGuards(JwtAuthGuard)
  async findManyTitulos(@Res() res: Response): Promise<void> {
    try {
      const idUser = res.locals.userID;

      const findTitle = await this.prisma.titulos.findMany({
        where: {
          login_id: idUser,
        },
        orderBy: {
          data_vencimento: "asc",
        },
      });

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

  @Post("/:id")
  @UseGuards(AuthService)
  async createTitulo(
    // @Req() req,
    @Body() createTituloDto
  ): Promise<{ message: string }> {
    try {
      // req.user.id;
      // AuthService;
      const verifyUser = await this.prisma.login.findFirst({
        where: {
          login: createTituloDto.login,
        },
        select: {
          id: true,
        },
      });

      if (!verifyUser) {
        throw new BadRequestException("Usuário não encontrado!");
      }

      const data_vencimentoISO = new Date(createTituloDto.data_vencimento);
      data_vencimentoISO.setHours(0, 5, 37, 0);

      await this.prisma.titulos.create({
        data: {
          valor: parseFloat(createTituloDto.valor),
          data_vencimento: data_vencimentoISO.toISOString(),
          boleto_codigo: createTituloDto.boleto_codigo,
          boleto_url: createTituloDto.boleto_url,
          curso: createTituloDto.curso,
          favorecido: createTituloDto.favorecido,
          pix_codigo: createTituloDto.pix_codigo,
          pix_url: createTituloDto.pix_url,
          situacao: createTituloDto.situacao,
          login_id: Number(verifyUser.id),
          external_code: createTituloDto.external_code,
        },
      });

      return {
        message: "Título adicionado com sucesso!",
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        "Não foi possível adicionar o título!"
      );
    }
  }
}
