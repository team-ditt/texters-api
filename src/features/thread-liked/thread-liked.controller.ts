import {OptionalAuthGuard} from "@/features/auth/optional-auth.guard";
import {ThreadLikedService} from "@/features/thread-liked/thread-liked.service";
import {Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";

@Controller()
export class ThreadLikedController {
  constructor(private readonly threadLikedService: ThreadLikedService) {}

  @Post("/boards/:boardId/threads/:threadId/liked")
  @UseGuards(OptionalAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async increaseThreadLiked(@Req() req: Request, @Param("threadId") threadId: number) {
    await this.threadLikedService.increaseThreadLiked(threadId, req["clientIp"], req["member"]);
  }
}
