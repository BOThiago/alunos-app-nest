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
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "./../prisma/prisma.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { removeEmpty } from "../functions/removeEmpty";
import JSONbig from "json-bigint";
import * as jwt from "jsonwebtoken";
@Controller("titulos")
export class TitulosController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async findManyTitulos(@Res() res, @Req() req): Promise<void> {
    try {
      const token = req.headers["x-access-token"];

      const decoded = jwt.verify(
        token,
        process.env.KEYSECRET
      ) as jwt.JwtPayload & {
        login: string;
      };

      const findTitle = await this.prisma.titulos.findMany({
        where: {
          login: {
            login: decoded.login,
          },
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

  @UseGuards(AuthService)
  @Post("/")
  async createTitulo(@Body() createTituloDto, @Req() req, @Res() res) {
    try {
      const token = req.headers["x-access-token"];

      const decoded = jwt.verify(
        token,
        process.env.KEYSECRET
      ) as jwt.JwtPayload & {
        login: string;
      };

      if (
        !createTituloDto.login_id ||
        !createTituloDto.valor ||
        !createTituloDto.data_vencimento ||
        !createTituloDto.external_code
      ) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Falta preencher os campos obrigatórios!",
        });
      }

      const verifyUser = await this.prisma.login.findFirst({
        where: {
          login: createTituloDto.login,
        },
        select: {
          id: true,
        },
      });

      if (!verifyUser) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: "Usuário não encontrado!",
        });
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
          login: {
            connect: {
              login: decoded.login,
            },
          },
        },
      });

      return res.status(HttpStatus.CREATED).json({
        message: "Título adicionado com sucesso!",
      });
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
    @Body() updateTituloDto: any,
    @Res() res,
    @Req() req
  ): Promise<void> {
    try {
      if (!updateTituloDto.external_code) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Falta preencher os campos obrigatórios!",
        });
      }

      let data: any = {
        valor: updateTituloDto.valor,
        data_vencimento: updateTituloDto.data_vencimento,
        boleto_codigo: updateTituloDto.boleto_codigo,
        boleto_url: updateTituloDto.boleto_url,
        curso: updateTituloDto.curso,
        favorecido: updateTituloDto.favorecido,
        pix_codigo: updateTituloDto.pix_codigo,
        pix_url: updateTituloDto.pix_url,
        situacao: updateTituloDto.situacao,
      };

      data = removeEmpty(updateTituloDto);

      const verificaTitulo = await this.prisma.titulos.findMany({
        where: {
          external_code: updateTituloDto.external_code,
        },
      });

      if (verificaTitulo.length < 1) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: "Título não encontrado!",
        });
      } else {
        await this.prisma.titulos.update({
          where: {
            external_code: updateTituloDto.external_code,
          },
          data: data,
        });

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
  async getDestaque(@Req() req, @Res() res) {
    try {
      const token = req.headers["x-access-token"];

      const decoded = jwt.verify(
        token,
        process.env.KEYSECRET
      ) as jwt.JwtPayload & {
        login: string;
      };

      const expiredTitle = await this.prisma.titulos.findMany({
        where: {
          login: {
            login: decoded.login,
          },
          situacao: {
            not: "pago",
          },
          data_vencimento: {
            lte: new Date(),
          },
        },
      });

      if (expiredTitle.length > 0) {
        return res
          .status(200)
          .send(JSONbig.stringify({ destaque: expiredTitle }));
      }

      if (expiredTitle.length < 1) {
        const expiringTitle = await this.prisma.titulos.findMany({
          where: {
            login: {
              login: decoded.login,
            },
            situacao: {
              not: "pago",
            },
            data_vencimento: {
              gte: new Date(),
            },
          },
          take: 1, // número de títulos que você queira puxar
        });

        if (expiringTitle.length > 0) {
          return res
            .status(200)
            .send(JSONbig.stringify({ destaque: expiringTitle }));
        } else {
          return res.status(404).json({ message: "Nenhum título encontrado!" });
        }
      } else {
        expiredTitle.length < 1;
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
  async getTituloById(@Req() req, @Res() res, @Param("id") id: string) {
    try {
      const token = req.headers["x-access-token"];

      const decoded = jwt.verify(
        token,
        process.env.KEYSECRET
      ) as jwt.JwtPayload & {
        login: string;
      };

      const findTitle = await this.prisma.titulos.findMany({
        where: {
          id: {
            equals: Number(id),
          },
          login: {
            login: decoded.login,
          },
        },
      });

      if (findTitle.length < 1) {
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
  async updateTitulo(@Req() req, @Res() res) {
    const {
      valor,
      data_vencimento,
      boleto_codigo,
      boleto_url,
      curso,
      favorecido,
      pix_codigo,
      pix_url,
      situacao,
      cic,
      external_code,
    } = req.body;

    try {
      const token = req.headers["x-access-token"];

      const decoded = jwt.verify(
        token,
        process.env.KEYSECRET
      ) as jwt.JwtPayload & {
        login: string;
      };

      if (!external_code) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          erro: HttpStatus.BAD_REQUEST,
          message: "Falta preencher campos obrigatórios",
        });
      }

      let data: any = {
        valor,
        boleto_codigo,
        boleto_url,
        curso,
        favorecido,
        pix_codigo,
        pix_url,
        situacao,
        external_code,
      };

      data = removeEmpty(data);

      let titulo = await this.prisma.titulos.findFirst({
        where: {
          external_code: external_code,
        },
      });

      if (titulo) {
        await this.prisma.titulos.update({
          where: {
            external_code: external_code,
          },
          data: data,
        });
        return res.status(HttpStatus.OK).json({
          external_code: external_code,
          message: "Título alterado com sucesso!",
        });
      }

      // Handle relaxed update when external_code is not found
      const login = await this.prisma.login.findFirst({
        where: {
          login: cic,
        },
      });

      if (!login) {
        return res.status(HttpStatus.NOT_FOUND).json({
          erro: HttpStatus.NOT_FOUND,
          external_code: external_code,
          cic: cic,
          mensagem: "Aluno não encontrado",
        });
      }

      const date = new Date(data_vencimento);
      const nextDate = new Date(data_vencimento);
      nextDate.setDate(nextDate.getDate() + 1);

      titulo = await this.prisma.titulos.findFirst({
        where: {
          login: {
            login: decoded.login,
          },
          data_vencimento: {
            gt: date,
            lt: nextDate,
          },
        },
      });

      if (!titulo) {
        return res.status(HttpStatus.NOT_FOUND).json({
          erro: HttpStatus.NOT_FOUND,
          external_code: external_code,
          cic: cic,
          data_vencimento: data_vencimento,
          mensagem: "Titulo não encontrado",
        });
      }

      await this.prisma.titulos.update({
        where: {
          external_code: titulo.external_code || "bogus",
        },
        data: data,
      });

      return res.status(HttpStatus.OK).json({
        external_code: external_code,
        real_external_code: titulo.external_code,
        cic: cic,
        data_vencimento: data_vencimento,
        message: "Título alterado com sucesso!",
      });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        external_code: external_code,
        error: err,
      });
    }
  }
}
