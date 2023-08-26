import {OptionalAuthGuard} from "@/features/auth/optional-auth.guard";
import {ThreadLikedService} from "@/features/thread-liked/thread-liked.service";
import {Controller, HttpCode, HttpStatus, Ip, Param, Post, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";

@Controller()
export class ThreadLikedController {
  constructor(private readonly threadLikedService: ThreadLikedService) {}

  @Post("/boards/:boardId/threads/:threadId/liked")
  @UseGuards(OptionalAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async increaseThreadLiked(
    @Req() req: Request,
    @Ip() ip: string,
    @Param("threadId") threadId: number,
  ) {
    await this.threadLikedService.increaseThreadLiked(threadId, ip, req["member"]);
  }
}
