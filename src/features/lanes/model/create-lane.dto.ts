import {IsNotEmpty, IsNumber, Min} from "class-validator";

export class CreateLaneDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  order: number;
}
