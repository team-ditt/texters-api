import {IsNotEmpty, IsString, Length} from "class-validator";

export class UpdateChoiceDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  content: string;
}
