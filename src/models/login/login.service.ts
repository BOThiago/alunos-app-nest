import { Injectable } from "@nestjs/common";
import { login } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { cleanCpf } from "../../functions/cpf";
import { verify } from "crypto";

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

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

  // Outros métodos relacionados ao usuário podem ser adicionados aqui
}
