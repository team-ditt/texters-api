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
  createChoice(@Param("pageId") pageId: number, @Body() createChoiceDto: CreateChoiceDto) {
    return this.choicesService.createChoice(pageId, createChoiceDto.content);
  }

  @Patch("books/:bookId/pages/:pageId/choices/:choiceId")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updateChoice(@Param("choiceId") choiceId: number, @Body() updateChoiceDto: UpdateChoiceDto) {
    return this.choicesService.updateChoiceById(choiceId, updateChoiceDto);
  }

  @Patch("books/:bookId/pages/:pageId/choices/:choiceId/destination")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updateChoiceDestination(
    @Param("choiceId") choiceId: number,
    @Body() updateChoiceDestinationDto: UpdateChoiceDestinationDto,
  ) {
    return this.choicesService.updateChoiceDestination(
      choiceId,
      updateChoiceDestinationDto.destinationPageId,
    );
  }

  @Patch("books/:bookId/pages/:pageId/choices/:choiceId/order")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  updateChoiceOrder(
    @Param("choiceId") choiceId: number,
    @Body() updateChoiceOrderDto: UpdateChoiceOrderDto,
  ) {
    return this.choicesService.updateChoiceOrder(choiceId, updateChoiceOrderDto.order);
  }

  @Delete("books/:bookId/pages/:pageId/choices/:choiceId")
  @UseGuards(AuthGuard, PublishedBookGuard, FlowChartGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteChoice(@Param("choiceId") choiceId: number) {
    return this.choicesService.deleteChoiceById(choiceId);
  }
}
