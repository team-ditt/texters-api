import {PublishedPagesService} from "@/features/published-pages/published-pages.service";
import {Controller, Get, Param} from "@nestjs/common";

@Controller()
export class PublishedPagesController {
  constructor(private readonly publishedPagesService: PublishedPagesService) {}

  @Get("books/:bookId/intro-page")
  findIntroPage(@Param("bookId") bookId: number) {
    return this.publishedPagesService.findIntroPage(bookId);
  }

  @Get("books/:bookId/pages/:pageId")
  findPage(@Param("pageId") pageId: number) {
    return this.publishedPagesService.findPageById(pageId);
  }
}
