import {IsNumberString, IsOptional, Length} from "class-validator";

export class DeleteThreadDto {
  @IsOptional()
  @IsNumberString()
  @Length(4, 8)
  password?: string;
}
