import {OptionalAuthGuard} from "@/features/auth/optional-auth.guard";
import {CreateThreadCommentDto} from "@/features/thread-comments/model/create-thread-comment.dto";
import {ThreadCommentMapper} from "@/features/thread-comments/thread-comment.mapper";
import {ThreadCommentsService} from "@/features/thread-comments/thread-comments.service";
import {Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";

@Controller()
export class ThreadCommentsController {
  constructor(
    private readonly threadsCommentService: ThreadCommentsService,
    private readonly threadCommentMapper: ThreadCommentMapper,
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
}
