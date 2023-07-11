import {ChoicesService} from "@/features/choices/choices.service";
import {Choice} from "@/features/choices/model/choice.entity";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {LanesService} from "@/features/lanes/lanes.service";
import {Page} from "@/features/pages/model/page.entity";
import {UpdatePageLaneDto} from "@/features/pages/model/update-page-lane.dto";
import {UpdatePageDto} from "@/features/pages/model/update-page.dto";
import {Inject, Injectable, forwardRef} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class PagesService {
  constructor(
    @Inject(forwardRef(() => LanesService))
    private readonly lanesService: LanesService,
    @Inject(forwardRef(() => ChoicesService))
    private readonly choicesService: ChoicesService,
    @InjectRepository(Page) private readonly pagesRepository: Repository<Page>,
    private readonly dataSource: DataSource,
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
    if (pages.length <= order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    pages.splice(page.order, 1);
    pages.splice(order, 0, page);
    pages.forEach((page, index) => (page.order = index));

    await Promise.all(pages.map(async page => await this.pagesRepository.save(page)));
    return page;
  }

  async updatePageLane(id: number, {laneId, order}: UpdatePageLaneDto) {
    const page = await this.pagesRepository.findOne({where: {id}, relations: {lane: true}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    if (page.isIntro()) throw new TextersHttpException("NO_EXPLICIT_INTRO_PAGE_MOVE");

    const targetLane = await this.lanesService.findLaneWithPagesById(laneId);
    if (!targetLane) throw new TextersHttpException("LANE_NOT_FOUND");
    if (targetLane.isIntro()) throw new TextersHttpException("NO_EXPLICIT_MOVE_TO_INTRO_LANE");
    if (targetLane.pages.length < order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    if (targetLane.order <= (await this.calculateMaxLaneOrderOfSourcePages(id)))
      throw new TextersHttpException("BAD_DESTINATION_PAGE_MOVE");
    if (targetLane.order >= (await this.calculateMinLaneOrderOfDestinationPages(id)))
      throw new TextersHttpException("BAD_SOURCE_PAGE_MOVE");

    await this.reorderSourceLanePages(page.laneId, page.order);
    await this.reorderDestinationLanePages(laneId, order);
    await this._updatePageLane(id, laneId, order);

    return await this.pagesRepository.findOne({where: {id}});
  }

  private async calculateMaxLaneOrderOfSourcePages(pageId: number) {
    const {max} = await this.dataSource
      .createQueryBuilder()
      .select("MAX(lane.order)")
      .from(Choice, "choice")
      .leftJoin("choice.sourcePage", "page")
      .leftJoin("page.lane", "lane")
      .where("choice.destinationPage = :pageId", {pageId})
      .getRawOne();
    return max ?? Number.MIN_SAFE_INTEGER;
  }

  private async calculateMinLaneOrderOfDestinationPages(pageId: number) {
    const {min} = await this.dataSource
      .createQueryBuilder()
      .select("MIN(lane.order)")
      .from(Choice, "choice")
      .leftJoin("choice.destinationPage", "page")
      .leftJoin("page.lane", "lane")
      .where("choice.sourcePage = :pageId", {pageId})
      .getRawOne();
    return min ?? Number.MAX_SAFE_INTEGER;
  }

  private async reorderSourceLanePages(laneId: number, order: number) {
    await this.pagesRepository
      .createQueryBuilder()
      .update()
      .set({
        order: () => "order - 1",
      })
      .where({laneId})
      .andWhere("page.order > :order", {order})
      .execute();
  }

  private async reorderDestinationLanePages(laneId: number, order: number) {
    await this.pagesRepository
      .createQueryBuilder()
      .update()
      .set({order: () => "order + 1"})
      .where({laneId})
      .andWhere("page.order >= :order", {order})
      .execute();
  }

  private async _updatePageLane(id: number, laneId: number, order: number) {
    await this.pagesRepository
      .createQueryBuilder()
      .update()
      .set({laneId, order})
      .where({id})
      .execute();
  }

  async deletePageById(id: number) {
    const page = await this.pagesRepository.findOne({where: {id}, relations: {lane: true}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    if (page.isIntro()) throw new TextersHttpException("NO_EXPLICIT_INTRO_PAGE_DELETION");

    await Promise.all([
      this.choicesService.deleteChoicesByPageId(id),
      this.choicesService.deleteDestinationsByPageId(id),
    ]);
    await this.pagesRepository.remove(page);
  }

  async isAuthor(memberId: number, pageId: number) {
    const page = await this.pagesRepository.findOne({
      where: {id: pageId},
      relations: {book: true},
    });
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    return page.book.authorId === memberId;
  }

  async findLaneOrderById(id: number) {
    const page = await this.pagesRepository.findOne({where: {id}, relations: {lane: true}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    return page.lane.order;
  }
}
