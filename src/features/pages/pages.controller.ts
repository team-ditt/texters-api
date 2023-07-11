import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {CreatePageDto} from "@/features/pages/model/create-page.dto";
import {UpdatePageLaneDto} from "@/features/pages/model/update-page-lane.dto";
import {UpdatePageOrderDto} from "@/features/pages/model/update-page-order.dto";
import {UpdatePageDto} from "@/features/pages/model/update-page.dto";
import {PageAuthorGuard} from "@/features/pages/page-author.guard";
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
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.CREATED)
  createPage(
    @Param("bookId") bookId: number,
    @Param("laneId") laneId: number,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.createPage(bookId, laneId, createPageDto.title);
  }

  @Patch("pages/:pageId")
  @UseGuards(AuthGuard, PageAuthorGuard)
  updatePage(@Param("pageId") pageId: number, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.updatePageById(pageId, updatePageDto);
  }

  @Patch("pages/:pageId/order")
  @UseGuards(AuthGuard, PageAuthorGuard)
  updatePageOrder(@Param("pageId") pageId: number, @Body() updatePageOrderDto: UpdatePageOrderDto) {
    return this.pagesService.updatePageOrder(pageId, updatePageOrderDto.order);
  }

  @Patch("pages/:pageId/lane")
  @UseGuards(AuthGuard, PageAuthorGuard)
  updatePageLane(@Param("pageId") pageId: number, @Body() updatePageLaneDto: UpdatePageLaneDto) {
    return this.pagesService.updatePageLane(pageId, updatePageLaneDto);
  }

  @Delete("pages/:pageId")
  @UseGuards(AuthGuard, PageAuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePage(@Param("pageId") pageId: number) {
    return this.pagesService.deletePageById(pageId);
  }
}
