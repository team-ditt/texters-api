import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Page} from "@/features/pages/model/page.entity";
import {UpdatePageDto} from "@/features/pages/model/update-page.dto";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class PagesService {
  constructor(@InjectRepository(Page) private readonly pagesRepository: Repository<Page>) {}

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

  async updatePage(bookId: number, laneId: number, pageId: number, updatePageDto: UpdatePageDto) {
    const page = await this.pagesRepository.findOne({where: {id: pageId, bookId, laneId}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    Object.assign(page, updatePageDto);
    return this.pagesRepository.save(page);
  }
}
