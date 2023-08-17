import {AuthGuard} from "@/features/auth/auth.guard";
import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {BookSearchParams} from "@/features/published-books/model/book-search.params";
import {PublishedBookMapper} from "@/features/published-books/published-book.mapper";
import {PublishedBooksService} from "@/features/published-books/published-books.service";
import {PaginationParams} from "@/features/shared/model/pagination.params";
import {PaginationMapper} from "@/features/shared/pagination.mapper";
import {Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards} from "@nestjs/common";

@Controller()
export class PublishedBooksController {
  constructor(
    private readonly publishedBooksService: PublishedBooksService,
    private readonly publishedBookMapper: PublishedBookMapper,
    private readonly paginationMapper: PaginationMapper,
  ) {}

  @Get("books")
  async findPublishedBooks(@Query() searchParams: BookSearchParams) {
    const {booksWithStatistics, totalCount} = await this.publishedBooksService.findPublishedBooks(
      searchParams,
    );
    return {
      data: booksWithStatistics.map(book =>
        this.publishedBookMapper.toResponseFromBookWithStatistics(book),
      ),
      ...this.paginationMapper.toPagination(searchParams.page, searchParams.limit, totalCount),
    };
  }

  @Get("books/weekly-most-viewed")
  async findWeeklyMostViewedPublishedBooks(@Query() {limit}: PaginationParams) {
    const books = await this.publishedBooksService.findWeeklyMostViewedBooks(limit);
    return books.map(book => this.publishedBookMapper.toResponseFromWeeklyView(book));
  }

  @Get("books/:bookId")
  async findBook(@Param("bookId") bookId: number) {
    const book = await this.publishedBooksService.findPublishedBookById(bookId);
    return this.publishedBookMapper.toResponseFromBookWithStatistics(book);
  }

  @Post("books/:bookId/publish")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async publishBook(@Param("bookId") bookId: number) {
    const book = await this.publishedBooksService.publishBookById(bookId);
    return this.publishedBookMapper.toResponseFromBookWithStatistics(book);
  }

  @Post("books/:bookId/unpublish")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unpublishBook(@Param("bookId") bookId: number) {
    await this.publishedBooksService.unpublishBookById(bookId);
  }
}
