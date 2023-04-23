import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AlterAddress {
  @ApiProperty()
  @IsNotEmpty({
    message: "O campo logradouro é obrigatório!",
  })
  @ApiProperty()
  logradouro: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "O campo cep é obrigatório!",
  })
  @ApiProperty()
  cep: string;

  @ApiProperty()
  numero: string;

  @ApiProperty()
  complemento: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "O campo bairro é obrigatório!",
  })
  @ApiProperty()
  bairro: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "O campo cidade é obrigatório!",
  })
  @ApiProperty()
  cidade: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "O campo uf é obrigatório!",
  })
  @ApiProperty()
  uf: string;
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
