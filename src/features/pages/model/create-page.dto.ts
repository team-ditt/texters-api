import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreatePageDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;
}
