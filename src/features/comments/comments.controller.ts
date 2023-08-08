import {CommentMapper} from "@/features/comments/comment.mapper";
import {CommentsService} from "@/features/comments/comments.service";
import {CreateCommentDto} from "@/features/comments/model/create-comment.dto";
import {AuthGuard} from "@/features/shared/auth.guard";
import {Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentMapper: CommentMapper,
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
    return this.commentMapper.toResponse(currentMemberId, comment);
  }
}
