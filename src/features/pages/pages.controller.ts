import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {CreatePageDto} from "@/features/pages/model/create-page.dto";
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
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.CREATED)
  createPage(
    @Param("bookId") bookId: number,
    @Param("laneId") laneId: number,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.createPage(bookId, laneId, createPageDto.title);
  }

  @Patch("books/:bookId/lanes/:laneId/pages/:pageId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  updatePage(@Param("pageId") pageId: number, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.updatePage(pageId, updatePageDto);
  }

  @Delete("books/:bookId/lanes/:laneId/pages/:pageId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePage(@Param("pageId") pageId: number) {
    return this.pagesService.deletePage(pageId);
  }
}
