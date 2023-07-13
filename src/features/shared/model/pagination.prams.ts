import {Transform} from "class-transformer";
import {IsNumber, IsOptional} from "class-validator";

export class PaginationParams {
  @IsOptional()
  @IsNumber()
  @Transform(({value}) => parseInt(value))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({value}) => parseInt(value))
  limit: number = 10;
}
