import {IsNotEmpty, IsNumber} from "class-validator";

export class UpdatePageOrderDto {
  @IsNotEmpty()
  @IsNumber()
  order: number;
}
