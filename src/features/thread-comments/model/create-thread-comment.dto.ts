import {IsNotEmpty, IsNumberString, IsOptional, IsString, Length} from "class-validator";

export class CreateThreadCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 2000)
  content: string;

  @IsOptional()
  @IsNumberString()
  @Length(4, 8)
  password?: string;
}
