import { Controller } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { emails } from "@prisma/client";
import { AlterAddress } from "./../dtos/Address/address.body";

@Controller()
export class AddressModelController {
  constructor(private prisma: PrismaService) {}

  async newEmail(alterAddress: any, findUser: any): Promise<emails | null> {
    await this.prisma.enderecos.create({
      data: {
        ativo: false,
        bairro: alterAddress.bairro,
        cep: alterAddress.cep,
        logradouro: alterAddress.logradouro,
        cidade: alterAddress.cidade,
        numero: alterAddress.numero || "S/N",
        uf: alterAddress.uf,
        complemento: alterAddress.complemento || "",
        id_pessoas: Number(findUser.id_pessoas),
      },
    });

    return;
  }

  async AlterAddress(
    enderecoExistente: any,
    alterAddress: any
  ): Promise<emails | null> {
    await this.prisma.enderecos.update({
      where: {
        id: enderecoExistente.id,
      },
      data: {
        ativo: false,
        bairro: alterAddress.bairro,
        cep: alterAddress.cep,
        logradouro: alterAddress.logradouro,
        cidade: alterAddress.cidade,
        numero: alterAddress.numero || "S/N",
        uf: alterAddress.uf,
        complemento: alterAddress.complemento || "",
      },
    });

    return;
  }
}
