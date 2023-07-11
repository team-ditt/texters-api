import {BookAuthorGuard} from "@/features/books/book-author.guard";
import {ChoicesService} from "@/features/choices/choices.service";
import {CreateChoiceDto} from "@/features/choices/model/create-choice.dto";
import {UpdateChoiceDto} from "@/features/choices/model/update-choice.dto";
import {AuthGuard} from "@/features/shared/auth.guard";
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

@Controller()
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Post("books/:bookId/lanes/:laneId/pages/:pageId/choices")
  @UseGuards(AuthGuard, BookAuthorGuard)
  @HttpCode(HttpStatus.CREATED)
  createChoice(@Param("pageId") pageId: number, @Body() createChoiceDto: CreateChoiceDto) {
    return this.choicesService.createChoice(pageId, createChoiceDto.content);
  }

  @Patch("books/:bookId/lanes/:laneId/pages/:pageId/choices/:choiceId")
  @UseGuards(AuthGuard, BookAuthorGuard)
  updateChoice(
    @Param("pageId") pageId: number,
    @Param("choiceId") choiceId: number,
    @Body() updateChoiceDto: UpdateChoiceDto,
  ) {
    return this.choicesService.updateChoice(pageId, choiceId, updateChoiceDto);
  }
}
