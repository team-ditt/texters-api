import {OptionalAuthGuard} from "@/features/auth/optional-auth.guard";
import {PaginationParams} from "@/features/shared/model/pagination.params";
import {PaginationMapper} from "@/features/shared/pagination.mapper";
import {AuthorizeThreadCommentPasswordDto} from "@/features/thread-comments/model/authorize-thread-comment-password.dto";
import {CreateThreadCommentDto} from "@/features/thread-comments/model/create-thread-comment.dto";
import {UpdateThreadCommentDto} from "@/features/thread-comments/model/update-thread-comment.dto";
import {ThreadCommentMapper} from "@/features/thread-comments/thread-comment.mapper";
import {ThreadCommentsService} from "@/features/thread-comments/thread-comments.service";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {Request} from "express";

@Controller()
export class ThreadCommentsController {
  constructor(
    private readonly threadsCommentService: ThreadCommentsService,
    private readonly threadCommentMapper: ThreadCommentMapper,
    private readonly paginationMapper: PaginationMapper,
  ) {}

  @Post("/boards/:boardId/threads/:threadId/comments")
  @UseGuards(OptionalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createThreadComment(
    @Req() req: Request,
    @Param("boardId") boardId: string,
    @Param("threadId") threadId: number,
    @Body() createThreadCommentDto: CreateThreadCommentDto,
  ) {
    const comment = await this.threadsCommentService.createComment(
      boardId,
      threadId,
      createThreadCommentDto,
      req["member"],
    );
    return this.threadCommentMapper.toResponse(comment, req["member"]);
  }

  @Post("/boards/:boardId/threads/:threadId/comments/:commentId/authorization")
  @HttpCode(HttpStatus.NO_CONTENT)
  async authorizePassword(
    @Param("threadId") threadId: number,
    @Param("commentId") commentId: number,
    @Body() {password}: AuthorizeThreadCommentPasswordDto,
  ) {
    await this.threadsCommentService.authorizePassword(threadId, commentId, password);
  }

  @Get("/boards/:boardId/threads/:threadId/comments")
  @UseGuards(OptionalAuthGuard)
  async findThreads(
    @Req() req: Request,
    @Param("threadId") threadId: number,
    @Query() {page, limit}: PaginationParams,
  ) {
    const {comments, totalCount} = await this.threadsCommentService.findComments(
      threadId,
      page,
      limit,
    );
    return {
      data: comments.map(comment => this.threadCommentMapper.toResponse(comment, req["member"])),
      ...this.paginationMapper.toPagination(page, limit, totalCount),
    };
  }

  @Patch("/boards/:boardId/threads/:threadId/comments/:commentId")
  @UseGuards(OptionalAuthGuard)
  async updateThread(
    @Req() req: Request,
    @Param("threadId") threadId: number,
    @Param("commentId") commentId: number,
    @Body() updateThreadCommentDto: UpdateThreadCommentDto,
  ) {
    const comment = await this.threadsCommentService.updateComment(
      threadId,
      commentId,
      updateThreadCommentDto,
      req["member"],
    );
    return this.threadCommentMapper.toResponse(comment, req["member"]);
  }
}
