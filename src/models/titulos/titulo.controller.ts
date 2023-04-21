import { Controller } from "@nestjs/common";
import { titulos, login } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { cleanCpf } from "src/functions/cpf";
import { removeEmpty } from "src/functions/removeEmpty";

interface Decoded {
  login: string;
  iat: number;
  exp: number;
}

@Controller()
export class TituloController {
  constructor(private prisma: PrismaService) {}

  async findTitles(Decoded: any): Promise<titulos[] | null> {
    const logins = await this.prisma.titulos.findMany({
      where: {
        login: {
          login: cleanCpf(Decoded.login),
        },
      },
      orderBy: {
        data_vencimento: "asc",
      },
    });

    return logins.length > 0 ? logins : null;
  }

  async findTitle(Decoded: any, id: any): Promise<titulos[] | null> {
    const findTitle = await this.prisma.titulos.findMany({
      where: {
        id: {
          equals: Number(id),
        },
        login: {
          login: Decoded.login,
        },
      },
    });

    return findTitle.length > 0 ? findTitle : null;
  }

  async findTitleEc(createTituloDtoEc: any): Promise<titulos | null> {
    let titulo = await this.prisma.titulos.findFirst({
      where: {
        external_code: createTituloDtoEc[10],
      },
    });

    return titulo;
  }

  async findFirstCic(createTituloDtoEc: any): Promise<login> {
    const login = await this.prisma.login.findFirst({
      where: {
        login: createTituloDtoEc[9],
      },
    });

    return login;
  }

  async findTitleExpired(
    createTituloDtoEc: any,
    decoded: any
  ): Promise<titulos | null> {
    const date = new Date(createTituloDtoEc[1]);
    const nextDate = new Date(createTituloDtoEc[1]);
    nextDate.setDate(nextDate.getDate() + 1);

    const titulo = await this.prisma.titulos.findFirst({
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

    return titulo;
  }

  async createTitulos(Decoded: any, createTituloDto: any): Promise<void> {
    if (Decoded === undefined || createTituloDto === undefined) {
      return null;
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
            login: Decoded.login,
          },
        },
      },
    });
  }

  async verifyTituloEC(updateTituloDto: any): Promise<titulos[]> {
    if (updateTituloDto === undefined) {
      return null;
    }

    const verificaTitulo = await this.prisma.titulos.findMany({
      where: {
        external_code: updateTituloDto.external_code,
      },
    });

    return verificaTitulo;
  }

  async updateTituloEC(updateTituloDto: any): Promise<titulos[]> {
    if (updateTituloDto === undefined) {
      return null;
    }

    let data = removeEmpty(updateTituloDto);

    await this.prisma.titulos.update({
      where: {
        external_code: updateTituloDto.external_code,
      },
      data: data,
    });

    return;
  }

  async updateTituloRelaxed(createTituloDtoEc: any): Promise<titulos[]> {
    await this.prisma.titulos.update({
      where: {
        external_code: createTituloDtoEc[10],
      },
      data: createTituloDtoEc,
    });

    return;
  }

  async updateTituloBogus(titulo: any, data: any): Promise<titulos[]> {
    await this.prisma.titulos.update({
      where: {
        external_code: titulo.external_code || "bogus",
      },
      data: data,
    });

    return;
  }

  async expiredTitulo(decoded: any): Promise<titulos[]> {
    if (decoded === undefined) {
      return null;
    }

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

    return expiredTitle;
  }

  async expiringTitulo(decoded: any): Promise<titulos[]> {
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

    return expiringTitle;
  }

  // Outros métodos relacionados à títulos podem ser adicionados aqui
}
