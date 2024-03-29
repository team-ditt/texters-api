import {AuthGuard} from "@/features/auth/auth.guard";
import {FlowChartGuard} from "@/features/books/flow-chart-guard";
import {LanesService} from "@/features/lanes/lanes.service";
import {CreateLaneDto} from "@/features/lanes/model/create-lane.dto";
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
  @UseGuards(AuthGuard, FlowChartGuard)
  @HttpCode(HttpStatus.CREATED)
  createLane(@Param("bookId") bookId: number, @Body() createLaneDto: CreateLaneDto) {
    return this.lanesService.createLane(bookId, createLaneDto.order);
  }

  @Delete("books/:bookId/lanes/:laneId")
  @UseGuards(AuthGuard, FlowChartGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteLane(@Param("bookId") bookId: number, @Param("laneId") laneId: number) {
    return this.lanesService.deleteLaneById(bookId, laneId);
  }
}
