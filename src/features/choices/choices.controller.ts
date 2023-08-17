import {AuthGuard} from "@/features/auth/auth.guard";
import {FlowChartGuard} from "@/features/books/flow-chart-guard";
import {PublishedBookGuard} from "@/features/books/published-book.guard";
import {ChoicesService} from "@/features/choices/choices.service";
import {CreateChoiceDto} from "@/features/choices/model/create-choice.dto";
import {UpdateChoiceDestinationDto} from "@/features/choices/model/update-choice-destination.dto";
import {UpdateChoiceOrderDto} from "@/features/choices/model/update-choice-order.dto";
import {UpdateChoiceDto} from "@/features/choices/model/update-choice.dto";
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

  @Post("books/:bookId/pages/:pageId/choices")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  @HttpCode(HttpStatus.CREATED)
  createChoice(
    @Param("bookId") bookId: number,
    @Param("pageId") pageId: number,
    @Body() createChoiceDto: CreateChoiceDto,
  ) {
    return this.choicesService.createChoice(bookId, pageId, createChoiceDto.content);
  }

  @Patch("books/:bookId/pages/:pageId/choices/:choiceId")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updateChoice(
    @Param("bookId") bookId: number,
    @Param("choiceId") choiceId: number,
    @Body() updateChoiceDto: UpdateChoiceDto,
  ) {
    return this.choicesService.updateChoiceById(bookId, choiceId, updateChoiceDto);
  }

  @Patch("books/:bookId/pages/:pageId/choices/:choiceId/destination")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updateChoiceDestination(
    @Param("bookId") bookId: number,
    @Param("choiceId") choiceId: number,
    @Body() updateChoiceDestinationDto: UpdateChoiceDestinationDto,
  ) {
    return this.choicesService.updateChoiceDestination(
      bookId,
      choiceId,
      updateChoiceDestinationDto.destinationPageId,
    );
  }

  @Patch("books/:bookId/pages/:pageId/choices/:choiceId/order")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updateChoiceOrder(
    @Param("bookId") bookId: number,
    @Param("choiceId") choiceId: number,
    @Body() updateChoiceOrderDto: UpdateChoiceOrderDto,
  ) {
    return this.choicesService.updateChoiceOrder(bookId, choiceId, updateChoiceOrderDto.order);
  }

  @Delete("books/:bookId/pages/:pageId/choices/:choiceId")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteChoice(@Param("bookId") bookId: number, @Param("choiceId") choiceId: number) {
    return this.choicesService.deleteChoice(bookId, choiceId);
  }
}
