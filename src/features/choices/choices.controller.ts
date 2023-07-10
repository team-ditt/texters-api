import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {ChoicesService} from "@/features/choices/choices.service";
import {CreateChoiceDto} from "@/features/choices/model/create-choice.dto";
import {AuthGuard} from "@/features/shared/auth.guard";
import {Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards} from "@nestjs/common";

@Controller()
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Post("books/:bookId/lanes/:laneId/pages/:pageId/choices")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.CREATED)
  createChoice(@Param("pageId") pageId: number, @Body() createChoiceDto: CreateChoiceDto) {
    this.choicesService.createChoice(pageId, createChoiceDto.content);
  }
}
