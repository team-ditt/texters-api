import {IsInt, IsNotEmpty, Min} from "class-validator";

export class CreateLaneDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order: number;
}
