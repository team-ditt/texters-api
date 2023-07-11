import {Choice} from "@/features/choices/model/choice.entity";
import {UpdateChoiceDto} from "@/features/choices/model/update-choice.dto";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ChoicesService {
  constructor(@InjectRepository(Choice) private readonly choicesRepository: Repository<Choice>) {}

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

  async deleteChoiceById(id: number) {
    const choice = await this.choicesRepository.findOne({where: {id}});
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");
    await this.choicesRepository.remove(choice);
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
      relations: ["sourcePage", "page.book"],
    });
    if (!choice) throw new TextersHttpException("CHOICE_NOT_FOUND");
    return choice.sourcePage.book.authorId === memberId;
  }
}
