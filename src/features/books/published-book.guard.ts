import {BooksService} from "@/features/books/books.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class PublishedBookGuard implements CanActivate {
  constructor(private readonly booksService: BooksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bookId = parseInt(request.params.bookId);

    const book = await this.booksService.findBookById(bookId);
    if (book.isPublished()) throw new TextersHttpException("ALREADY_PUBLISHED");
    return true;
  }
}
