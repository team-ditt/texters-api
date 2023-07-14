import {Transform} from "class-transformer";
import {IsInt, IsOptional, IsPositive} from "class-validator";

export class PaginationParams {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({value}) => parseInt(value))
  page: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({value}) => parseInt(value))
  limit: number = 10;
}
