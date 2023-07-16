import {IsInt, IsNotEmpty, Min} from "class-validator";

export class UpdateChoiceOrderDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order: number;
}
