import {IsNumber, IsOptional} from "class-validator";

export class UpdateChoiceDestinationDto {
  @IsOptional()
  @IsNumber()
  destinationPageId: number;
}
