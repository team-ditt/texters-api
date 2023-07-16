import {IsInt, IsOptional, IsPositive} from "class-validator";

export class UpdateChoiceDestinationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  destinationPageId: number;
}
