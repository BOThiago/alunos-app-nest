import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { LoginService } from "../models/login/login.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private LoginService: LoginService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader("x-access-token"),
      ignoreExpiration: false,
      secretOrKey: `${process.env.KEYSECRET}` || "your_jwt_secret",
    });
  }

  async validate(payload: { login: string }) {
    const user = await this.LoginService.findByLogin(payload.login);

    if (user === null) {
      throw new UnauthorizedException({ message: "Token Expirado" });
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
