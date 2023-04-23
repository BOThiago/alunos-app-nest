import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendTokenDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "O email é obrigatório!",
  })
  @IsEmail({})
  email: string;
}
