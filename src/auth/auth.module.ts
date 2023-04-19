import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { jwtConstants } from "./constants";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      global: true,
      secretOrPrivateKey: jwtConstants.secret,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [AuthService, UserService, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
