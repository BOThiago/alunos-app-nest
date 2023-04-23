import { HttpStatus } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { Response } from "express";

export function verifyAndDecodeToken(
  token: string,
  res: Response
):
  | (jwt.JwtPayload & {
      login: string;
      userID: number;
      guid: string;
      ies: string;
    })
  | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.KEYSECRET
    ) as jwt.JwtPayload & {
      login: string;
      userID: number;
      guid: string;
      ies: string;
    };
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // Token expirou, enviar uma resposta HTTP 401
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Token expirou, faça login novamente para continuar.",
      });
    } else {
      // Outro erro de autenticação, enviar uma resposta HTTP 401
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Não autorizado.",
      });
    }
    return null; // Retorne 'null' em caso de erro
  }
}
