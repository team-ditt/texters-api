import {AuthGuard} from "@/features/auth/auth.guard";
import {OptionalAuthGuard} from "@/features/auth/optional-auth.guard";
import {BookCommentCommenterGuard} from "@/features/book-comments/book-comment-commenter.guard";
import {BookCommentMapper} from "@/features/book-comments/book-comment.mapper";
import {BookCommentsService} from "@/features/book-comments/book-comments.service";
import {CreateBookCommentDto} from "@/features/book-comments/model/create-book-comment.dto";
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
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {Request} from "express";

@Controller()
export class BookCommentsController {
  constructor(
    private readonly bookCommentsService: BookCommentsService,
    private readonly bookCommentMapper: BookCommentMapper,
    private readonly paginationMapper: PaginationMapper,
  ) {}

  @Post("books/:bookId/comments")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Req() req: Request,
    @Param("bookId") bookId: number,
    @Body() createBookCommentDto: CreateBookCommentDto,
  ) {
    const {id: currentMemberId, penName} = req["member"];
    const comment = await this.bookCommentsService.createComment(
      bookId,
      currentMemberId,
      penName,
      createBookCommentDto,
    );
    return this.bookCommentMapper.toResponse(comment, currentMemberId);
  }

  @Get("books/:bookId/comments")
  @UseGuards(OptionalAuthGuard)
  async findComments(
    @Req() req: Request,
    @Param("bookId") bookId: number,
    @Query() {page, limit}: PaginationParams,
  ) {
    const {comments, totalCount} = await this.bookCommentsService.findComments(bookId, page, limit);
    return {
      data: comments.map(comment => this.bookCommentMapper.toResponse(comment, req["member"]?.id)),
      ...this.paginationMapper.toPagination(page, limit, totalCount),
    };
  }

  @Delete("comments/:commentId")
  @UseGuards(AuthGuard, BookCommentCommenterGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBook(@Param("commentId") commentId: number) {
    return this.bookCommentsService.deleteCommentById(commentId);
  }
}
