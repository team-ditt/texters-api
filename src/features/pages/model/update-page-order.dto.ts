import {IsInt, IsNotEmpty, Min} from "class-validator";

export class UpdatePageOrderDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order: number;
}
