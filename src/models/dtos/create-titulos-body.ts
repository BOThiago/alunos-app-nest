import { IsNotEmpty } from "class-validator";

export class createTituloDto {
  @IsNotEmpty({
    message: "O valor do título é obrigatório!",
  })
  valor: Number;

  @IsNotEmpty({
    message: "A data_vencimento do título é obrigatório!",
  })
  data_vencimento: Date;

  boleto_codigo: string;
  boleto_url: string;
  curso: string;
  favorecido: string;

  @IsNotEmpty({
    message: "O login_id vinculado ao título é obrigatório!",
  })
  login_id: Number;

  pix_codigo: string;
  pix_url: string;
  situacao: string;

  @IsNotEmpty({
    message: "O external_code do título é obrigatório!",
  })
  external_code: string;
}

export class createTituloDtoEc {
  valor: Number;
  data_vencimento: string;
  boleto_codigo: string;
  boleto_url: string;
  curso: string;
  favorecido: string;
  pix_codigo: string;
  pix_url: string;
  situacao: string;
  cic: string;

  @IsNotEmpty({
    message: "O external_code do título é obrigatório!",
  })
  external_code: string;
}
