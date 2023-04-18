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
import { VerifyAccessTokenMiddleware } from "../middlewares/verifyAccessToken.middleware";

import JSONbig from "json-bigint";
import { Response } from "express";

@Controller("titulos")
export class TitulosController {
  constructor(private prisma: PrismaService) {}

  @Get("/")
  @UseInterceptors(VerifyAccessTokenMiddleware)
  @UseGuards(AuthService)
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

  //   @Post("/")
  //   @UseGuards(AuthService)
  //   async createTitulo(
  //     @Req() req,
  //     @Body() createTituloDto:
  //   ): Promise<{ message: string }> {
  //     try {
  //       const idUser = req.user.id;
  //       const verifyUser = await this.prisma.login.findUnique({
  //         where: {
  //           login: createTituloDto.login,
  //         },
  //         select: {
  //           id: true,
  //         },
  //       });

  //       if (!verifyUser) {
  //         throw new BadRequestException("Usuário não encontrado!");
  //       }

  //       const data_vencimentoISO = new Date(createTituloDto.data_vencimento);
  //       data_vencimentoISO.setHours(0, 5, 37, 0);

  //       const newTitulo = await this.prisma.titulos.create({
  //         data: {
  //           valor: createTituloDto.valor,
  //           data_vencimento: data_vencimentoISO.toISOString(),
  //           boleto_codigo: createTituloDto.boleto_codigo,
  //           boleto_url: createTituloDto.boleto_url,
  //           curso: createTituloDto.curso,
  //           favorecido: createTituloDto.favorecido,
  //           pix_codigo: createTituloDto.pix_codigo,
  //           pix_url: createTituloDto.pix_url,
  //           situacao: createTituloDto.situacao,
  //           login_id: verifyUser.id,
  //           external_code: createTituloDto.external_code,
  //         },
  //       });

  //       return {
  //         message: "Título adicionado com sucesso!",
  //       };
  //     } catch (err) {
  //       console.log(err);
  //       throw new InternalServerErrorException(
  //         "Não foi possível adicionar o título!"
  //       );
  //     }
  //   }
}
