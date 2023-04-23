import { Injectable } from "@nestjs/common";
import { login } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { cleanCpf } from "../../functions/cpf";
import { sendEmailDto } from "../dtos/email/send-email-body";
import { AlterAddress } from "./../dtos/Address/address.body";
import { Decoded } from "../../interfaces/decoded";
@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  async createLogin(
    addLoginDto: any,
    hashedPassword: string
  ): Promise<login | null> {
    const pessoas = await this.prisma.pessoas.create({
      data: {
        nome: addLoginDto.name,
        emails: {
          create: {
            contato: addLoginDto.email,
            ativo: true,
            validado: true,
          },
        },
        enderecos: {
          create: {
            ativo: true,
            cep: addLoginDto.cep || "",
            logradouro: addLoginDto.logradouro,
            numero: addLoginDto.numero || "S/N",
            complemento: addLoginDto.complemento || "",
            bairro: addLoginDto.bairro || "",
            cidade: addLoginDto.cidade || "",
            uf: addLoginDto.uf || "",
          },
        },
        telefones: {
          create: {
            ativo: true,
            validado: true,
            contato: addLoginDto.telefone,
            whatsapp: addLoginDto.whatsapp,
          },
        },
      },
    });

    await this.prisma.login.create({
      data: {
        login: cleanCpf(addLoginDto.login),
        password: hashedPassword,
        change_password: true,
        email: addLoginDto.email,
        message: addLoginDto.message || "",
        id_pessoas: pessoas.id,
      },
    });

    return;
  }

  async findByLogin(login: string): Promise<login | null> {
    if (login === undefined) {
      return null;
    }

    const verifyLogin = await this.prisma.login.findFirst({
      where: {
        login: cleanCpf(login),
      },
    });

    return verifyLogin;
  }

  async findByEmail(email: string): Promise<login | null> {
    if (email === undefined) {
      return null;
    }

    const verifyLogin = await this.prisma.login.findFirst({
      where: {
        email: email,
      },
    });

    return verifyLogin;
  }

  async findByID(login_id: number): Promise<login | null> {
    if (login_id === undefined) {
      return null;
    }

    const verifyLogin = await this.prisma.login.findUnique({
      where: {
        id: login_id,
      },
    });

    return verifyLogin;
  }

  async findByCic(cic: string): Promise<login | null> {
    if (cic === undefined) {
      return null;
    }

    const login = await this.prisma.login.findFirst({
      where: {
        login: cic,
      },
    });

    return login;
  }

  async findTokenRecover(token: string): Promise<login | null> {
    if (token === undefined) {
      return null;
    }

    const Recover = await this.prisma.login.findFirst({
      where: {
        tokenRedefinicaoSenha: token,
        expiracaoTokenRedefinicaoSenha: {
          gte: new Date().toISOString(),
        },
      },
    });

    return Recover;
  }

  async updatePassword(
    decoded: any,
    hashedPassword: string
  ): Promise<login | null> {
    if (decoded === undefined || hashedPassword === undefined) {
      return null;
    }

    const updatedUser = await this.prisma.login.update({
      where: {
        login: decoded.login,
      },
      data: {
        password: hashedPassword,
        change_password: false,
      },
    });

    return updatedUser;
  }

  async updatePasswordToken(
    token: string,
    hashedPassword: string
  ): Promise<login | null> {
    if (token === undefined || hashedPassword === undefined) {
      return null;
    }

    await this.prisma.login.update({
      where: {
        tokenRedefinicaoSenha: token,
      },
      data: {
        password: hashedPassword,
        tokenRedefinicaoSenha: null,
        expiracaoTokenRedefinicaoSenha: null,
      },
    });

    return;
  }

  async sendEmailToken(
    sendEmailDto: any,
    token: any,
    expiracao: any
  ): Promise<login | null> {
    if (sendEmailDto === undefined) {
      return null;
    }

    const userUpdated = await this.prisma.login.update({
      where: {
        login: sendEmailDto.login,
      },
      data: {
        tokenRedefinicaoSenha: token,
        expiracaoTokenRedefinicaoSenha: expiracao.toISOString(),
      },
    });

    return userUpdated;
  }

  async removeUserTest(addLoginDto: any): Promise<login | null> {
    await this.prisma.login.delete({
      where: {
        login: cleanCpf(addLoginDto.login),
      },
    });

    return;
  }

  async findUserGuid(AlterAddress: any, Decoded: any): Promise<login | null> {
    const findUser = await this.prisma.login.findUnique({
      where: {
        guid: Decoded.guid,
      },
      include: {
        pessoas: {
          include: {
            enderecos: true,
          },
        },
      },
    });

    return findUser;
  }
  // Outros métodos relacionados ao usuário podem ser adicionados aqui
}
