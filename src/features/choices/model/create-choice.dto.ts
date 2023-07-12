import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateChoiceDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  content: string;
}
