import { Injectable } from "@nestjs/common";
import { login } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { cleanCpf } from "src/functions/cpf";

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService) {}

  async findByLogin(login: string): Promise<login | null> {
    if (login === undefined) {
      return null;
    }

    return await this.prisma.login.findFirst({
      where: {
        login: cleanCpf(login),
      },
    });
  }

  // Outros métodos relacionados ao usuário podem ser adicionados aqui
}
