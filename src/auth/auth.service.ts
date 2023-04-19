import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async authenticate(login: string, password: string) {
    const user = await this.userService.findByLogin(login);

    if (!user) {
      return {
        success: false,
        statusCode: 401,
        message: "Usuário não encontrado!",
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        statusCode: 401,
      };
    }

    const payload = { login: user.login };
    const userData = [
      user.login,
      user.email,
      user.ies,
      user.message,
      user.name,
    ];

    return {
      success: true,
      userData,
      access_token: this.jwtService.sign(
        { login: payload.login },
        {
          secret: process.env.KEYSECRET,
          expiresIn: "1h",
        }
      ),
    };
  }
}
