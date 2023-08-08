import {CommentCommenterGuard} from "@/features/comments/comment-commenter.guard";
import {CommentMapper} from "@/features/comments/comment.mapper";
import {CommentsService} from "@/features/comments/comments.service";
import {CreateCommentDto} from "@/features/comments/model/create-comment.dto";
import {AuthGuard} from "@/features/shared/auth.guard";
import {PaginationParams} from "@/features/shared/model/pagination.params";
import {OptionalAuthGuard} from "@/features/shared/optional-auth.guard";
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
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentMapper: CommentMapper,
    private readonly paginationMapper: PaginationMapper,
  ) {}

  @Post("books/:bookId/comments")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Req() req: Request,
    @Param("bookId") bookId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const {id: currentMemberId, penName} = req["member"];
    const comment = await this.commentsService.createComment(
      bookId,
      currentMemberId,
      penName,
      createCommentDto,
    );
    return this.commentMapper.toResponse(comment, currentMemberId);
  }

  @Get("books/:bookId/comments")
  @UseGuards(OptionalAuthGuard)
  async findComments(
    @Req() req: Request,
    @Param("bookId") bookId: number,
    @Query() {page, limit}: PaginationParams,
  ) {
    const {comments, totalCount} = await this.commentsService.findComments(bookId, page, limit);
    return {
      data: comments.map(comment => this.commentMapper.toResponse(comment, req["member"]?.id)),
      ...this.paginationMapper.toPagination(page, limit, totalCount),
    };
  }

  @Delete("comments/:commentId")
  @UseGuards(AuthGuard, CommentCommenterGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBook(@Param("commentId") commentId: number) {
    return this.commentsService.deleteCommentById(commentId);
  }
}
