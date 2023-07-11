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
    @Inject(forwardRef(() => PagesService))
    private readonly pagesService: PagesService,
    @InjectRepository(Choice) private readonly choicesRepository: Repository<Choice>,
  ) {}

  async createChoice(pageId: number, content: string) {
    const choicesInPage = await this.choicesRepository.count({where: {sourcePageId: pageId}});
    if (choicesInPage >= 5) throw new TextersHttpException("TOO_MANY_CHOICES");

    const choice = Choice.of(pageId, content, choicesInPage);
    return await this.choicesRepository.save(choice);
  }

  async updateChoiceById(id: number, updateChoiceDto: UpdateChoiceDto) {
    const choice = await this.choicesRepository.findOne({where: {id}});
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");

    Object.assign(choice, updateChoiceDto);
    return await this.choicesRepository.save(choice);
  }

  async updateChoiceDestination(id: number, destinationPageId: number | null) {
    const choice = await this.choicesRepository.findOne({
      where: {id},
      relations: {sourcePage: {lane: true}},
    });
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");

    const destinationLaneOrder = await this.pagesService.findLaneOrderById(destinationPageId);
    if (destinationLaneOrder && choice.sourcePage.lane.order >= destinationLaneOrder)
      throw new TextersHttpException("BAD_CHOICE_DESTINATION");

    choice.destinationPageId = destinationPageId;
    return await this.choicesRepository.save(choice);
  }

  async updateChoiceOrder(id: number, order: number) {
    const choice = await this.choicesRepository.findOne({where: {id}});
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");

    const choicesInPages = await this.choicesRepository.count({
      where: {sourcePageId: choice.sourcePageId},
    });
    if (choicesInPages <= order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    await this.reorder("decrease", choice.sourcePageId, choice.order + 1);
    await this.reorder("increase", choice.sourcePageId, order);
    Object.assign(choice, {order});

    return this.choicesRepository.save(choice);
  }

  async deleteChoiceById(id: number) {
    const choice = await this.choicesRepository.findOne({where: {id}});
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");

    await Promise.all([
      this.reorder("decrease", choice.sourcePageId, choice.order + 1),
      this.choicesRepository.remove(choice),
    ]);
  }

  async deleteChoicesByPageId(sourcePageId: number) {
    const choices = await this.choicesRepository.find({where: {sourcePageId}});
    await Promise.all(choices.map(choice => this.choicesRepository.remove(choice)));
  }

  async deleteDestinationsByPageId(destinationPageId: number) {
    const choices = await this.choicesRepository.find({where: {destinationPageId}});
    await Promise.all(
      choices.map(choice => {
        choice.destinationPageId = null;
        return this.choicesRepository.save(choice);
      }),
    );
  }

  async isAuthor(memberId: number, choiceId: number) {
    const choice = await this.choicesRepository.findOne({
      where: {id: choiceId},
      relations: {sourcePage: {book: true}},
    });
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");
    return choice.sourcePage.book.authorId === memberId;
  }

  private async reorder(type: "increase" | "decrease", sourcePageId: number, from: number) {
    const setOrderQuery = () => (type === "increase" ? "order + 1" : "order - 1");
    await this.choicesRepository
      .createQueryBuilder()
      .update()
      .set({order: setOrderQuery})
      .where({sourcePageId})
      .andWhere("choice.order >= :from", {from})
      .execute();
  }
}
