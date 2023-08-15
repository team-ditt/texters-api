import {IsNotEmpty, IsNumberString, Length} from "class-validator";

export class AuthorizeThreadCommentPasswordDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 8)
  password: string;
}
