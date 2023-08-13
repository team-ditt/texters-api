import {OptionalAuthGuard} from "@/features/auth/optional-auth.guard";
import {CreateThreadDto} from "@/features/threads/model/create-thread.dto";
import {ThreadMapper} from "@/features/threads/thread.mapper";
import {ThreadsService} from "@/features/threads/threads.service";
import {Body, Controller, Param, Post, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";

@Controller()
export class ThreadsController {
  constructor(
    private readonly threadsService: ThreadsService,
    private readonly threadMapper: ThreadMapper,
  ) {}

  @Post("/boards/:boardId/threads")
  @UseGuards(OptionalAuthGuard)
  async createThread(
    @Req() req: Request,
    @Param("boardId") boardId: string,
    @Body() createThreadDto: CreateThreadDto,
  ) {
    const thread = await this.threadsService.createThread(boardId, createThreadDto, req["member"]);
    return this.threadMapper.toResponse(thread, req["member"]);
  }
}
