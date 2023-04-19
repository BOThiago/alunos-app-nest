import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader("x-access-token"),
      ignoreExpiration: false,
      secretOrKey: `${process.env.KEYSECRET}` || "your_jwt_secret",
    });
  }

  async validate(payload: { login: string }) {
    const user = await this.userService.findByLogin(payload.login);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
