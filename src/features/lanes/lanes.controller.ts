import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {LanesService} from "@/features/lanes/lanes.service";
import {CreateLaneDto} from "@/features/lanes/model/create-lane.dto";
import {AuthGuard} from "@/features/shared/auth.guard";
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

@Controller()
export class LanesController {
  constructor(private readonly lanesService: LanesService) {}

  @Post("books/:bookId/lanes")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.CREATED)
  createLane(@Param("bookId") bookId: number, @Body() createLaneDto: CreateLaneDto) {
    return this.lanesService.createLane(bookId, createLaneDto.order);
  }

  @Delete("books/:bookId/lanes/:laneId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteLane(@Param("bookId") bookId: number, @Param("laneId") laneId: number) {
    return this.lanesService.deleteLane(bookId, laneId);
  }
}
