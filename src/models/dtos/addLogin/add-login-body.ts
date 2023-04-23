import { IsNotEmpty, IsEmail, IsPhoneNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddLoginDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "O campo login é obrigatório!",
  })
  login: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "O campo password é obrigatório!",
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "O campo telefone é obrigatório!",
  })
  @IsPhoneNumber("BR")
  telefone: string;

  @ApiProperty()
  @IsEmail({})
  email: string;

  @ApiProperty()
  ies: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  logradouro: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  numero: string;

  @ApiProperty()
  complemento: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  uf: string;

  @ApiProperty()
  whatsapp: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "O campo login é obrigatório!",
  })
  login: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "O campo password é obrigatório!",
  })
  password: string;
}
