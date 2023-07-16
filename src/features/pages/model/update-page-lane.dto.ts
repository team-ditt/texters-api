import {IsInt, IsNotEmpty, IsPositive, Min} from "class-validator";

export class UpdatePageLaneDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  laneId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order: number;
}
