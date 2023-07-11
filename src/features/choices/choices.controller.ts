import {ChoiceAuthorGuard} from "@/features/choices/choice-author.guard";
import {ChoicesService} from "@/features/choices/choices.service";
import {CreateChoiceDto} from "@/features/choices/model/create-choice.dto";
import {UpdateChoiceDto} from "@/features/choices/model/update-choice.dto";
import {PageAuthorGuard} from "@/features/pages/page-author.guard";
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
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Post("pages/:pageId/choices")
  @UseGuards(AuthGuard, PageAuthorGuard)
  @HttpCode(HttpStatus.CREATED)
  createChoice(@Param("pageId") pageId: number, @Body() createChoiceDto: CreateChoiceDto) {
    return this.choicesService.createChoice(pageId, createChoiceDto.content);
  }

  @Patch("choices/:choiceId")
  @UseGuards(AuthGuard, ChoiceAuthorGuard)
  updateChoice(@Param("choiceId") choiceId: number, @Body() updateChoiceDto: UpdateChoiceDto) {
    return this.choicesService.updateChoiceById(choiceId, updateChoiceDto);
  }

  @Delete("choices/:choiceId")
  @UseGuards(AuthGuard, ChoiceAuthorGuard)
  deleteChoice(@Param("choiceId") choiceId: number) {
    return this.choicesService.deleteChoiceById(choiceId);
  }
}
