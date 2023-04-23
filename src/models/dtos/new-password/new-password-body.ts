import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class NewPassword {
  @ApiProperty()
  @IsNotEmpty({
    message: "O campo login é obrigatório!",
  })
  newPassword: string;
}
