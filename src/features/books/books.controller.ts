import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {BookMapper} from "@/features/books/book.mapper";
import {BooksService} from "@/features/books/books.service";
import {CreateBookDto} from "@/features/books/model/create-book-request.dto";
import {UpdateBookDto} from "@/features/books/model/update-book-request.dto";
import {AuthGuard} from "@/features/shared/auth.guard";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

@Controller("books")
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly bookMapper: BookMapper,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async saveBook(@Req() req: Request, @Body() createBookDto: CreateBookDto) {
    const book = await this.booksService.createBook(req["member"].id, createBookDto);
    return this.bookMapper.toResponse(book);
  }

  @Get(":bookId")
  async readBook(@Param("bookId") bookId: number) {
    const book = await this.booksService.readBook(bookId);
    return this.bookMapper.toResponse(book);
  }

  @Patch(":bookId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async updateBook(@Param("bookId") bookId: number, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.booksService.updateBook(bookId, updateBookDto);
    return this.bookMapper.toResponse(book);
  }

  @Delete(":bookId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBook(@Param("bookId") bookId: number) {
    return await this.booksService.deleteBook(bookId);
  }
}
