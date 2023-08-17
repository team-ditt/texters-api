import {AuthGuard} from "@/features/auth/auth.guard";
import {FlowChartGuard} from "@/features/books/flow-chart-guard";
import {PublishedBookGuard} from "@/features/books/published-book.guard";
import {CreatePageDto} from "@/features/pages/model/create-page.dto";
import {UpdatePageLaneDto} from "@/features/pages/model/update-page-lane.dto";
import {UpdatePageOrderDto} from "@/features/pages/model/update-page-order.dto";
import {UpdatePageDto} from "@/features/pages/model/update-page.dto";
import {PageMapper} from "@/features/pages/page.mapper";
import {PagesService} from "@/features/pages/pages.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

@Controller()
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly pageMapper: PageMapper,
  ) {}

  @Post("books/:bookId/lanes/:laneId/pages")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  @HttpCode(HttpStatus.CREATED)
  createPage(
    @Param("bookId") bookId: number,
    @Param("laneId") laneId: number,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.createPage(bookId, laneId, createPageDto);
  }

  @Get("books/:bookId/intro-page")
  async findIntroPage(@Param("bookId") bookId: number) {
    const introPage = await this.pagesService.findIntroPage(bookId);
    return this.pageMapper.toResponse(introPage);
  }

  @Get("books/:bookId/pages/:pageId")
  async findPage(@Param("pageId") pageId: number) {
    const page = await this.pagesService.findPageById(pageId);
    return this.pageMapper.toResponse(page);
  }

  @Patch("books/:bookId/pages/:pageId")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updatePage(
    @Param("bookId") bookId: number,
    @Param("pageId") pageId: number,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.updatePage(bookId, pageId, updatePageDto);
  }

  @Patch("books/:bookId/pages/:pageId/order")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updatePageOrder(
    @Param("bookId") bookId: number,
    @Param("pageId") pageId: number,
    @Body() updatePageOrderDto: UpdatePageOrderDto,
  ) {
    return this.pagesService.updatePageOrder(bookId, pageId, updatePageOrderDto.order);
  }

  @Patch("books/:bookId/pages/:pageId/lane")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updatePageLane(
    @Param("bookId") bookId: number,
    @Param("pageId") pageId: number,
    @Body() updatePageLaneDto: UpdatePageLaneDto,
  ) {
    return this.pagesService.updatePageLane(bookId, pageId, updatePageLaneDto);
  }

  @Delete("books/:bookId/pages/:pageId")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePage(@Param("bookId") bookId: number, @Param("pageId") pageId: number) {
    return this.pagesService.deletePage(bookId, pageId);
  }
}
