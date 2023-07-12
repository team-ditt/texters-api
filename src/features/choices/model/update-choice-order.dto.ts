import {IsNotEmpty, IsNumber} from "class-validator";

export class UpdateChoiceOrderDto {
  @IsNotEmpty()
  @IsNumber()
  order: number;
}
