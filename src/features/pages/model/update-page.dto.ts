import {IsOptional, IsString, Length} from "class-validator";

export class UpdatePageDto {
  @IsOptional()
  @IsString()
  @Length(1, 30)
  title: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  content: string;
}
