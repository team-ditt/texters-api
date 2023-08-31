import {BooksService} from "@/features/books/books.service";
import {Choice} from "@/features/choices/model/choice.entity";
import {UpdateChoiceDto} from "@/features/choices/model/update-choice.dto";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {PagesService} from "@/features/pages/pages.service";
import {Inject, Injectable, forwardRef} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ChoicesService {
  constructor(
    @Inject(forwardRef(() => BooksService))
    private readonly booksService: BooksService,
    private readonly pagesService: PagesService,
    @InjectRepository(Choice) private readonly choiceRepository: Repository<Choice>,
  ) {}

  async createChoice(bookId: number, pageId: number, content: string) {
    const choicesInPage = await this.choiceRepository.count({where: {sourcePageId: pageId}});
    if (choicesInPage >= 5) throw new TextersHttpException("TOO_MANY_CHOICES");

    const choice = await this.choiceRepository.save(Choice.of(pageId, content, choicesInPage));
    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return choice;
  }

  async updateChoiceById(bookId: number, choiceId: number, updateChoiceDto: UpdateChoiceDto) {
    const choice = await this.choiceRepository.findOne({where: {id: choiceId}});
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");

    Object.assign(choice, updateChoiceDto);
    await this.choiceRepository.save(choice);
    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return choice;
  }

  async updateChoiceDestination(
    bookId: number,
    choiceId: number,
    destinationPageId: number | null,
  ) {
    const choice = await this.choiceRepository.findOne({
      where: {id: choiceId},
      relations: {sourcePage: {lane: true}},
    });
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");

    choice.destinationPageId = destinationPageId;
    await this.choiceRepository.save(choice);
    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return choice;
  }

  async updateChoiceOrder(bookId: number, choiceId: number, order: number) {
    const choice = await this.choiceRepository.findOne({where: {id: choiceId}});
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");

    const page = await this.pagesService.findPageById(choice.sourcePageId);
    if (page.choices.length <= order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    page.choices.splice(choice.order, 1);
    page.choices.splice(order, 0, choice);
    const choices = await this.reorder(page.choices);

    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return choices[order];
  }

  async deleteChoice(bookId: number, choiceId: number) {
    const choice = await this.choiceRepository.findOne({
      where: {id: choiceId},
      relations: {sourcePage: {choices: true}},
    });
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");

    choice.sourcePage.choices.splice(choice.order, 1);
    await Promise.all([
      this.reorder(choice.sourcePage.choices),
      this.choiceRepository.remove(choice),
      this.booksService.updateBookUpdatedAtToNow(bookId),
    ]);
  }

  async isAuthor(memberId: number, choiceId: number) {
    const choice = await this.choiceRepository.findOne({
      where: {id: choiceId},
      relations: {sourcePage: {book: true}},
    });
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");
    return choice.sourcePage.book.authorId === memberId;
  }

  private async reorder(choices: Choice[]) {
    return await Promise.all(
      choices.map((choice, order) => {
        choice.order = order;
        return this.choiceRepository.save(choice);
      }),
    );
  }
}
