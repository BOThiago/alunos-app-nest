import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { jwtConstants } from "./constants";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      global: true,
      secretOrPrivateKey: jwtConstants.secret,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    PrismaService,
    JwtAuthGuard,
    JwtService,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
