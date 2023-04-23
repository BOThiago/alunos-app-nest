import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeEmailDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "O campo token é obrigatório!",
  })
  token: string;

  @ApiProperty()
  @IsEmail({})
  email: string;
}
