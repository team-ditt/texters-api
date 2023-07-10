import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {CreatePageDto} from "@/features/pages/model/create-page.dto";
import {PagesService} from "@/features/pages/pages.service";
import {AuthGuard} from "@/features/shared/auth.guard";
import {Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards} from "@nestjs/common";

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
    return this.pagesService.create(bookId, laneId, createPageDto.title);
  }
}
