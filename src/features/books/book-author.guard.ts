import {BooksService} from "@/features/books/books.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class BookAuthorGuard implements CanActivate {
  constructor(private readonly booksService: BooksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bookId = parseInt(request.params.bookId);
    const memberId = request.member.id;

    const isAuthor = await this.booksService.isAuthor(memberId, bookId);
    if (!isAuthor) throw new TextersHttpException("NOT_AUTHOR_OF_BOOK");
    return true;
  }
}
