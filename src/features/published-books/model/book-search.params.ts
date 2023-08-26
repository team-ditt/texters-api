import {PaginationParams} from "@/features/shared/model/pagination.params";
import {IsEnum, IsOptional, IsString} from "class-validator";

export enum BookOrderBy {
  VIEWED = "viewed",
  LIKED = "liked",
  PUBLISHED_DATE = "published-date",
}

export class BookSearchParams extends PaginationParams {
  @IsOptional()
  @IsString()
  query: string = "";

  @IsOptional()
  @IsEnum(BookOrderBy)
  order: BookOrderBy = BookOrderBy.VIEWED;
}
