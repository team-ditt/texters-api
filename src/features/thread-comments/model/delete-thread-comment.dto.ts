import {IsNumberString, IsOptional, Length} from "class-validator";

export class DeleteThreadCommentDto {
  @IsOptional()
  @IsNumberString()
  @Length(4, 8)
  password?: string;
}
