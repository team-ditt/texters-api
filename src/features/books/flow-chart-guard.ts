import {BooksService} from "@/features/books/books.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {LocksService} from "@/features/locks/locks.service";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class FlowChartGuard implements CanActivate {
  constructor(
    private readonly locksService: LocksService,
    private readonly booksService: BooksService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bookId = parseInt(request.params.bookId);
    const memberId = request.member.id;
    const key = request.headers["flow-chart-lock-key"];

    const canEdit = await this.locksService.canEditFlowChart(bookId, key);
    if (!canEdit) throw new TextersHttpException("LOCKED_FLOW_CHART");

    const isAuthor = await this.booksService.isAuthor(memberId, bookId);
    if (!isAuthor) throw new TextersHttpException("NOT_AUTHOR");

    return canEdit && isAuthor;
  }
}
