import {IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsString, Length} from "class-validator";

export class CreateThreadDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 10000)
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  isHidden: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isFixed: boolean;

  @IsOptional()
  @IsNumberString()
  @Length(4, 8)
  password?: string;
}
