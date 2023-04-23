import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTituloDto {
  @ApiProperty()
  @IsNotEmpty({
    message: "O valor do título é obrigatório!",
  })
  valor: Number;

  @ApiProperty()
  @IsNotEmpty({
    message: "A data_vencimento do título é obrigatório!",
  })
  data_vencimento: Date;

  @ApiProperty()
  boleto_codigo: string;

  @ApiProperty()
  boleto_url: string;

  @ApiProperty()
  curso: string;

  @ApiProperty()
  favorecido: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "O login_id vinculado ao título é obrigatório!",
  })
  login_id: Number;

  @ApiProperty()
  pix_codigo: string;

  @ApiProperty()
  pix_url: string;

  @ApiProperty()
  situacao: string;

  @IsNotEmpty({
    message: "O external_code do título é obrigatório!",
  })
  external_code: string;
}

export class CreateTituloDtoEc {
  @ApiProperty()
  valor: Number;

  @ApiProperty()
  data_vencimento: string;

  @ApiProperty()
  boleto_codigo: string;

  @ApiProperty()
  boleto_url: string;

  @ApiProperty()
  curso: string;

  @ApiProperty()
  favorecido: string;

  @ApiProperty()
  pix_codigo: string;

  @ApiProperty()
  pix_url: string;

  @ApiProperty()
  situacao: string;

  @ApiProperty()
  cic: string;

  @IsNotEmpty({
    message: "O external_code do título é obrigatório!",
  })
  external_code: string;
}
