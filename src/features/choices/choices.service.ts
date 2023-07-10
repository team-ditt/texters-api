import {Choice} from "@/features/choices/model/choice.entity";
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
}
