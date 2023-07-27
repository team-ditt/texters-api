import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {BookMapper} from "@/features/books/book.mapper";
import {BooksService} from "@/features/books/books.service";
import {DashBoardGuard} from "@/features/books/dash-board-guard";
import {BookSearchParams} from "@/features/books/model/book-search.params";
import {CreateBookDto} from "@/features/books/model/create-book.dto";
import {UpdateBookDto} from "@/features/books/model/update-book.dto";
import {LocksService} from "@/features/locks/locks.service";
import {AuthGuard} from "@/features/shared/auth.guard";
import {PaginationParams} from "@/features/shared/model/pagination.params";
import {PaginationMapper} from "@/features/shared/pagination.mapper";
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
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {Request, Response} from "express";

@Controller()
export class BooksController {
  constructor(
    private readonly locksService: LocksService,
    private readonly booksService: BooksService,
    private readonly bookMapper: BookMapper,
    private readonly paginationMapper: PaginationMapper,
  ) {}

  @Post("books")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createBook(@Req() req: Request, @Body() createBookDto: CreateBookDto) {
    const book = await this.booksService.createBook(req["member"].id, createBookDto);
    return this.bookMapper.toResponse(book);
  }

  @Get("members/:memberId/books")
  @UseGuards(AuthGuard, DashBoardGuard)
  async findMyBooks(@Param("memberId") memberId: number, @Query() {page, limit}: PaginationParams) {
    const {books, totalCount} = await this.booksService.findBooksByAuthorId(memberId, page, limit);
    return {
      data: books.map(book => this.bookMapper.toResponse(book)),
      ...this.paginationMapper.toPagination(page, limit, totalCount),
    };
  }

  @Get("members/:memberId/books/:bookId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async findMyBook(@Param("bookId") bookId: number) {
    return this.findBook(bookId);
  }

  @Get("books")
  async findPublishedBooks(@Query() searchParams: BookSearchParams) {
    const {books, totalCount} = await this.booksService.findPublishedBooks(searchParams);
    return {
      data: books.map(book => this.bookMapper.toResponse(book)),
      ...this.paginationMapper.toPagination(searchParams.page, searchParams.limit, totalCount),
    };
  }

  @Get("books/weekly-most-viewed")
  async findWeeklyMostViewedBooks(@Query() {limit}: PaginationParams) {
    const books = await this.booksService.findWeeklyMostViewedBooks(limit);
    return books.map(book => this.bookMapper.rawToResponse(book));
  }

  @Get("books/:bookId")
  async findBook(@Param("bookId") bookId: number) {
    const book = await this.booksService.findBookById(bookId);
    return this.bookMapper.toResponse(book);
  }

  @Get("books/:bookId/flow-chart")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async loadFlowChart(@Param("bookId") bookId: number, @Res() res: Response) {
    const bookWithFlowChart = await this.booksService.loadFlowChart(bookId);
    const lock = await this.locksService.lockFlowChart(bookId);

    const response = this.bookMapper.toResponse(bookWithFlowChart);
    res.set("flow-chart-lock-key", lock.key);
    res.send(response);
  }

  @Patch("books/:bookId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async updateBook(@Param("bookId") bookId: number, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.booksService.updateBookById(bookId, updateBookDto);
    return this.bookMapper.toResponse(book);
  }

  @Put("books/:bookId/publish")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async publishBook(@Param("bookId") bookId: number) {
    const book = await this.booksService.publishBookById(bookId);
    return this.bookMapper.toResponse(book);
  }

  @Delete("books/:bookId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBook(@Param("bookId") bookId: number) {
    return await this.booksService.deleteBookById(bookId);
  }
}
