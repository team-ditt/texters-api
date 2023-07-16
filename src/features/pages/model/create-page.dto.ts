import {IsInt, IsNotEmpty, IsString, Length, Min} from "class-validator";

export class CreatePageDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  order: number;
}
