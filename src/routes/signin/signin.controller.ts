import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "../../auth/auth.service";

@Controller("signin")
export class SigninController {
  constructor(private authService: AuthService) {}

  @Post()
  async signin(
    @Body("login") login: string,
    @Body("password") password: string,
    @Res() res: Response
  ): Promise<any> {
    try {
      const result = await this.authService.authenticate(login, password);

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        return res.status(result.statusCode).json(result.message);
      }
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json("Não foi possível logar!");
    }
  }
}
