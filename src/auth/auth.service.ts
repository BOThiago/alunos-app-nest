import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcryptjs from "bcryptjs";
import { verifyCpf, cleanCpf } from "../functions/cpf";
import { getSecretKey } from "../functions/key";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async authenticate(login: string, password: string): Promise<any> {
    try {
      if (!login || !password) {
        return {
          success: false,
          statusCode: 432,
          message: "Usuário ou senha não preenchidos!",
        };
      }

      if (!verifyCpf(login)) {
        return { success: false, statusCode: 432, message: "CPF inválido!" };
      }

      const validLogin = await this.prisma.login.findMany({
        where: {
          login: cleanCpf(login),
        },
        select: {
          id: true,
        },
      });

      if (validLogin.length < 1) {
        return {
          success: false,
          statusCode: 432,
          message: "Usuário ou senha inválidos!",
        };
      }

      const id = validLogin[0].id;

      const validPassword = await this.prisma.login.findMany({
        where: {
          id: id,
        },
        select: {
          password: true,
        },
      });

      const getPassword = validPassword[0].password;

      const userData = await this.prisma.login.findFirst({
        where: {
          login: login,
        },
        select: {
          name: true,
          email: true,
          change_password: true,
          ies: true,
        },
      });

      let ies: string;
      if (userData) {
        ies = userData.ies || "";
      }

      const match = await bcryptjs.compare(password, getPassword);

      if (match) {
        const token = jwt.sign(
          { userID: id, login: login, ies: ies },
          getSecretKey(),
          {
            expiresIn: "1h",
          }
        );

        return {
          success: true,
          message: "Usuário autenticado com sucesso!",
          token: token,
          userData: userData,
        };
      } else {
        return {
          success: false,
          statusCode: 432,
          message: "Usuário ou senha inválidos!",
        };
      }
    } catch (error) {
      console.error(error);
      throw new Error("Não foi possível logar!");
    }
  }
}
