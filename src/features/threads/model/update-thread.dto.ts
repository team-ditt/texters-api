import {IsBoolean, IsNumberString, IsOptional, IsString, Length} from "class-validator";

export class UpdateThreadDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10000)
  content?: string;

  @IsOptional()
  @IsBoolean()
  isFixed?: boolean;

  @IsOptional()
  @IsNumberString()
  @Length(4, 8)
  password?: string;
}
