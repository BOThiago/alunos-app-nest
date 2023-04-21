import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginService } from "../models/login/login.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private LoginService: LoginService,
    private readonly jwtService: JwtService
  ) {}

  async authenticate(login: string, password: string) {
    const user = await this.LoginService.findByLogin(login);

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
        statusCode: HttpStatus.UNAUTHORIZED,
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
          expiresIn: process.env.TIMETOKEN,
        }
      ),
      expiresIn: process.env.TIMETOKEN,
    };
  }
}
