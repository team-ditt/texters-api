import {IsAlpha, IsNotEmpty, IsString, Length} from "class-validator";

export class CreateBoardDto {
  @IsNotEmpty()
  @IsAlpha()
  @Length(1)
  id: string;

  @IsNotEmpty()
  @IsString()
  @Length(1)
  name: string;
}
