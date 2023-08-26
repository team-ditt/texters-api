import {AuthGuard} from "@/features/auth/auth.guard";
import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {BookMapper} from "@/features/books/book.mapper";
import {BooksService} from "@/features/books/books.service";
import {DashBoardGuard} from "@/features/books/dash-board-guard";
import {CreateBookDto} from "@/features/books/model/create-book.dto";
import {UpdateBookDto} from "@/features/books/model/update-book.dto";
import {LocksService} from "@/features/locks/locks.service";
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
    const bookWithStatistics = await this.booksService.createBook(req["member"].id, createBookDto);
    return this.bookMapper.toResponseFromBookWithStatistics(bookWithStatistics);
  }

  @Get("members/:memberId/books")
  @UseGuards(AuthGuard, DashBoardGuard)
  async findMyBooks(@Param("memberId") memberId: number, @Query() {page, limit}: PaginationParams) {
    const {booksWithStatistics, totalCount} = await this.booksService.findBooks(
      memberId,
      page,
      limit,
    );
    return {
      data: booksWithStatistics.map(book => this.bookMapper.toResponseFromBookWithStatistics(book)),
      ...this.paginationMapper.toPagination(page, limit, totalCount),
    };
  }

  @Get("members/:memberId/books/:bookId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async findMyBook(@Param("bookId") bookId: number) {
    const book = await this.booksService.findBookById(bookId);
    return this.bookMapper.toResponseFromBookWithStatistics(book);
  }

  @Get("books/:bookId/flow-chart")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async loadFlowChart(@Param("bookId") bookId: number, @Res() res: Response) {
    const bookWithFlowChart = await this.booksService.loadFlowChart(bookId);
    const lock = await this.locksService.lockFlowChart(bookId);

    const response = this.bookMapper.toResponse(bookWithFlowChart);
    res.setHeader("X-Flow-Chart-Lock-Key", lock.key);
    res.send(response);
  }

  @Patch("books/:bookId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  async updateBook(@Param("bookId") bookId: number, @Body() updateBookDto: UpdateBookDto) {
    const bookWithStatistics = await this.booksService.updateBookById(bookId, updateBookDto);
    return this.bookMapper.toResponseFromBookWithStatistics(bookWithStatistics);
  }

  @Delete("books/:bookId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBook(@Param("bookId") bookId: number) {
    await this.booksService.deleteBookById(bookId);
  }
}
