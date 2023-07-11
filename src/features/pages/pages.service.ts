import {ChoicesService} from "@/features/choices/choices.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Page} from "@/features/pages/model/page.entity";
import {UpdatePageDto} from "@/features/pages/model/update-page.dto";
import {Inject, Injectable, forwardRef} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class PagesService {
  constructor(
    @Inject(forwardRef(() => ChoicesService))
    private readonly choicesService: ChoicesService,
    @InjectRepository(Page) private readonly pagesRepository: Repository<Page>,
  ) {}

  async hasAnyPages(laneId: number) {
    return await this.pagesRepository.exist({where: {laneId}});
  }

  async createIntroPage(bookId: number, laneId: number) {
    const INTRO_PAGE_TITLE = "제목을 입력해 주세요";
    return await this.pagesRepository.save(Page.of(bookId, laneId, INTRO_PAGE_TITLE, 0));
  }

  async createPage(bookId: number, laneId: number, title: string) {
    const pagesInBook = await this.pagesRepository.count({where: {bookId}});
    if (pagesInBook >= 100) throw new TextersHttpException("TOO_MANY_PAGES");

    const pagesInLane = await this.pagesRepository.count({where: {laneId}});
    const page = Page.of(bookId, laneId, title, pagesInLane);
    return await this.pagesRepository.save(page);
  }

  async updatePageById(id: number, updatePageDto: UpdatePageDto) {
    const page = await this.pagesRepository.findOne({where: {id}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    Object.assign(page, updatePageDto);
    return this.pagesRepository.save(page);
  }

  async updatePageOrder(id: number, order: number) {
    const page = await this.pagesRepository.findOne({where: {id}});
    const pages = await this.pagesRepository.find({
      where: {laneId: page.laneId},
      order: {order: "ASC"},
    });

    pages.splice(page.order, 1);
    pages.splice(order, 0, page);
    pages.forEach((page, index) => (page.order = index));

    await Promise.all(pages.map(async page => await this.pagesRepository.save(page)));
    return page;
  }

  async deletePageById(id: number) {
    const page = await this.pagesRepository.findOne({where: {id}, relations: ["lane"]});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    const isIntroPage = page.lane.order === 0 && page.order === 0;
    if (isIntroPage) throw new TextersHttpException("NO_EXPLICIT_INTRO_PAGE_DELETION");

    await Promise.all([
      this.choicesService.deleteChoicesByPageId(id),
      this.choicesService.deleteDestinationsByPageId(id),
    ]);
    await this.pagesRepository.remove(page);
  }

  async isAuthor(memberId: number, pageId: number) {
    const page = await this.pagesRepository.findOne({
      where: {id: pageId},
      relations: ["book"],
    });
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    return page.book.authorId === memberId;
  }

  async findLaneOrderById(id: number) {
    const page = await this.pagesRepository.findOne({where: {id}, relations: ["lane"]});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    return page.lane.order;
  }
}
