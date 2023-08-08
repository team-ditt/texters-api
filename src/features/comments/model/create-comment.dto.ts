import {IsBoolean, IsNotEmpty, IsString, Length} from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsBoolean()
  isSpoiler: boolean;

  @IsNotEmpty()
  @IsString()
  @Length(1, 2000)
  content: string;
}
