import { Controller } from "@nestjs/common";
import { pessoas, login } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { AlterAddress } from "./../dtos/Address/address.body";

@Controller()
export class UserModelController {
  constructor(private prisma: PrismaService) {}

  async findUser(decoded: any): Promise<pessoas | null> {
    const findUser = await this.prisma.login.findUnique({
      where: {
        guid: decoded.guid,
      },
      include: {
        pessoas: true, // Altere para 'true' para incluir todas as propriedades de 'pessoas'
      },
    });

    if (!findUser) {
      return null; // Retorne 'null' se o usuário não for encontrado
    }

    return findUser.pessoas; // Retorne o registro de pessoas associado ao usuário encontrado
  }

  async findUserEmail(decoded: any): Promise<pessoas | null> {
    const users = await this.prisma.login.findUnique({
      where: {
        guid: decoded.guid,
      },
      include: {
        pessoas: {
          include: {
            emails: true,
          },
        },
      },
    });

    if (!users) {
      return null;
    }

    return users.pessoas;
  }

  async newPerson(
    user: any,
    expiracao: any,
    userToken: any
  ): Promise<pessoas | null> {
    const novaPessoa = await this.prisma.pessoas.create({
      data: {
        nome: user.name || "",
        emails: {
          create: {
            ativo: false,
            validado: false,
            contato: "",
            token_expiracao: expiracao.toISOString(),
            token_validacao: userToken,
          },
        },
      },
    });

    return novaPessoa;
  }

  async updatePerson(decoded: any, newPerson: any): Promise<pessoas | null> {
    await this.prisma.login.update({
      where: {
        guid: decoded.guid,
      },
      data: {
        id_pessoas: newPerson.id,
      },
    });

    return;
  }

  async newPersonAddress(
    findUser: any,
    alterAddress: any
  ): Promise<pessoas | null> {
    const novaPessoa = await this.prisma.pessoas.create({
      data: {
        nome: findUser.name || "",
        enderecos: {
          create: {
            cep: alterAddress.cep,
            ativo: false,
            bairro: alterAddress.bairro,
            cidade: alterAddress.cidade,
            logradouro: alterAddress.logradouro,
            numero: alterAddress.numero || "S/N",
            uf: alterAddress.uf,
            complemento: alterAddress.complemento || "",
          },
        },
      },
    });

    return novaPessoa;
  }
}
