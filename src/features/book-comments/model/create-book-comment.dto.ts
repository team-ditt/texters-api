import {IsBoolean, IsNotEmpty, IsString, Length} from "class-validator";

export class CreateBookCommentDto {
  @IsNotEmpty()
  @IsBoolean()
  isSpoiler: boolean;

  @IsNotEmpty()
  @IsString()
  @Length(1, 2000)
  content: string;
}
