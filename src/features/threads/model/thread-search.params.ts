import {PaginationParams} from "@/features/shared/model/pagination.params";
import {IsEnum, IsOptional, IsString} from "class-validator";

export enum ThreadOrderBy {
  CREATED_AT = "created-at",
  LIKED = "liked",
}

export enum ThreadType {
  ALL = "all",
  FIXED = "fixed",
}

export class ThreadSearchParams extends PaginationParams {
  @IsOptional()
  @IsString()
  type: ThreadType = ThreadType.ALL;

  @IsOptional()
  @IsEnum(ThreadOrderBy)
  order: ThreadOrderBy = ThreadOrderBy.CREATED_AT;
}
