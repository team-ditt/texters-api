import {OptionalAuthGuard} from "@/features/auth/optional-auth.guard";
import {PaginationMapper} from "@/features/shared/pagination.mapper";
import {CreateThreadDto} from "@/features/threads/model/create-thread.dto";
import {ThreadSearchParams} from "@/features/threads/model/thread-search.params";
import {ThreadMapper} from "@/features/threads/thread.mapper";
import {ThreadsService} from "@/features/threads/threads.service";
import {
  Body,
  Controller,
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
export class ThreadsController {
  constructor(
    private readonly threadsService: ThreadsService,
    private readonly threadMapper: ThreadMapper,
    private readonly paginationMapper: PaginationMapper,
  ) {}

  @Post("/boards/:boardId/threads")
  @UseGuards(OptionalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createThread(
    @Req() req: Request,
    @Param("boardId") boardId: string,
    @Body() createThreadDto: CreateThreadDto,
  ) {
    const thread = await this.threadsService.createThread(boardId, createThreadDto, req["member"]);
    return this.threadMapper.toResponse(thread, req["member"]);
  }

  @Get("/boards/:boardId/threads")
  @UseGuards(OptionalAuthGuard)
  async findThreads(
    @Req() req: Request,
    @Param("boardId") boardId: string,
    @Query() searchParams: ThreadSearchParams,
  ) {
    const {threads, totalCount} = await this.threadsService.findThreads(boardId, searchParams);
    return {
      data: threads.map(thread => this.threadMapper.toResponse(thread, req["member"])),
      ...this.paginationMapper.toPagination(searchParams.page, searchParams.limit, totalCount),
    };
  }
}
