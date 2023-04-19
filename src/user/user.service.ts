import { Injectable } from "@nestjs/common";
import { login } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { cleanCpf } from "src/functions/cpf";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByLogin(login: string): Promise<login | null> {
    return await this.prisma.login.findFirst({
      where: {
        login: cleanCpf(login),
      },
    });
  }

  // Outros métodos relacionados ao usuário podem ser adicionados aqui
}
