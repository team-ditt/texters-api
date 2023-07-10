import {BooksService} from "@/features/books/books.service";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class BookAuthorGuard implements CanActivate {
  constructor(private readonly bookService: BooksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bookId = parseInt(request.params.bookId);
    const memberId = request.member.id;

    return await this.bookService.isAuthor(memberId, bookId);
  }
}
