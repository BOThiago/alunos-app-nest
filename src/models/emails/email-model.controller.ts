import { Controller } from "@nestjs/common";
import { emails } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";

@Controller()
export class EmailModelController {
  constructor(private prisma: PrismaService) {}

  async newEmail(
    user: any,
    tokenUser: any,
    expiracao: any
  ): Promise<emails | null> {
    await this.prisma.emails.create({
      data: {
        ativo: false,
        validado: false,
        contato: "",
        token_expiracao: expiracao.toISOString(),
        token_validacao: tokenUser,
        id_pessoas: Number(user.id_pessoas),
      },
    });

    return;
  }

  async updateToken(
    tokenUser: any,
    emailExistente: any,
    expiracao: any
  ): Promise<emails | null> {
    await this.prisma.emails.update({
      where: {
        id: emailExistente.id,
      },
      data: {
        token_expiracao: expiracao.toISOString(),
        token_validacao: tokenUser,
      },
    });

    return;
  }

  async findEmails(changeEmailDto: any): Promise<emails | null> {
    const user = await this.prisma.emails.findFirst({
      where: {
        token_validacao: changeEmailDto.token,
        token_expiracao: {
          gte: new Date().toISOString(),
        },
      },
    });

    return user;
  }

  async updateEmail(changeEmailDto: any): Promise<emails | null> {
    const updateEmail = await this.prisma.emails.update({
      where: {
        token_validacao: changeEmailDto.token,
      },
      data: {
        contato: changeEmailDto.email,
        validado: true,
        token_expiracao: null,
        token_validacao: null,
      },
    });

    return updateEmail;
  }
}
