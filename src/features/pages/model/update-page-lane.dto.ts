import {IsNotEmpty, IsNumber} from "class-validator";

export class UpdatePageLaneDto {
  @IsNotEmpty()
  @IsNumber()
  laneId: number;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}
