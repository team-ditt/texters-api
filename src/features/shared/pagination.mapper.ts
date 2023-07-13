import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Injectable} from "@nestjs/common";

@Injectable()
export class PaginationMapper {
  toPagination(page: number, limit: number, totalCount: number) {
    const totalPages = Math.ceil(totalCount / limit);
    if (page > totalPages) throw new TextersHttpException("INVALID_PAGE_PARAM");
    return {
      page,
      limit,
      isFirst: page === 1,
      isLast: page === totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
      totalPages,
      totalCount,
    };
  }
}
