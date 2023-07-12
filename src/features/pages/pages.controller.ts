import {FlowChartGuard} from "@/features/books/flow-chart-guard";
import {CreatePageDto} from "@/features/pages/model/create-page.dto";
import {UpdatePageLaneDto} from "@/features/pages/model/update-page-lane.dto";
import {UpdatePageOrderDto} from "@/features/pages/model/update-page-order.dto";
import {UpdatePageDto} from "@/features/pages/model/update-page.dto";
import {PagesService} from "@/features/pages/pages.service";
import {AuthGuard} from "@/features/shared/auth.guard";
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

@Controller()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post("books/:bookId/lanes/:laneId/pages")
  @UseGuards(AuthGuard, FlowChartGuard)
  @HttpCode(HttpStatus.CREATED)
  createPage(
    @Param("bookId") bookId: number,
    @Param("laneId") laneId: number,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.createPage(bookId, laneId, createPageDto.title);
  }

  @Patch("books/:bookId/pages/:pageId")
  @UseGuards(AuthGuard, FlowChartGuard)
  updatePage(@Param("pageId") pageId: number, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.updatePageById(pageId, updatePageDto);
  }

  @Patch("books/:bookId/pages/:pageId/order")
  @UseGuards(AuthGuard, FlowChartGuard)
  updatePageOrder(@Param("pageId") pageId: number, @Body() updatePageOrderDto: UpdatePageOrderDto) {
    return this.pagesService.updatePageOrder(pageId, updatePageOrderDto.order);
  }

  @Patch("books/:bookId/pages/:pageId/lane")
  @UseGuards(AuthGuard, FlowChartGuard)
  updatePageLane(@Param("pageId") pageId: number, @Body() updatePageLaneDto: UpdatePageLaneDto) {
    return this.pagesService.updatePageLane(pageId, updatePageLaneDto);
  }

  @Delete("books/:bookId/pages/:pageId")
  @UseGuards(AuthGuard, FlowChartGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePage(@Param("pageId") pageId: number) {
    return this.pagesService.deletePageById(pageId);
  }
}
