import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class sendEmailDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "O campo login é obrigatório!",
  })
  login: string;

  @ApiProperty()
  @IsEmail({})
  email: string;
}
