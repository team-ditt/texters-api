import {BooksService} from "@/features/books/books.service";
import {ChoicesService} from "@/features/choices/choices.service";
import {Choice} from "@/features/choices/model/choice.entity";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {LanesService} from "@/features/lanes/lanes.service";
import {CreatePageDto} from "@/features/pages/model/create-page.dto";
import {Page} from "@/features/pages/model/page.entity";
import {UpdatePageLaneDto} from "@/features/pages/model/update-page-lane.dto";
import {UpdatePageDto} from "@/features/pages/model/update-page.dto";
import {Inject, Injectable, forwardRef} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import * as R from "ramda";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class PagesService {
  constructor(
    @Inject(forwardRef(() => BooksService))
    private readonly booksService: BooksService,
    @Inject(forwardRef(() => LanesService))
    private readonly lanesService: LanesService,
    @Inject(forwardRef(() => ChoicesService))
    private readonly choicesService: ChoicesService,
    @InjectRepository(Page) private readonly pageRepository: Repository<Page>,
    private readonly dataSource: DataSource,
  ) {}

  async createIntroPage(bookId: number, laneId: number) {
    const INTRO_PAGE_TITLE = "페이지 제목을 입력해 주세요";
    return await this.pageRepository.save(Page.of(bookId, laneId, INTRO_PAGE_TITLE, 0));
  }

  async createPage(bookId: number, laneId: number, {title, order}: CreatePageDto) {
    const pagesInLane = await this.pageRepository.count({where: {laneId}});
    if (pagesInLane < order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    await this.reorder("increase", laneId, order);
    const page = Page.of(bookId, laneId, title, pagesInLane);
    return await this.pageRepository.save(page);
  }

  async findIntroPage(bookId: number) {
    const introPage = await this.pageRepository.findOne({
      where: {bookId, lane: {order: 0}, order: 0},
      relations: {lane: true, choices: true},
      order: {choices: {order: "ASC"}},
    });
    if (!introPage) throw new TextersHttpException("PAGE_NOT_FOUND");

    const book = await this.booksService.findBookById(bookId);
    if (book.isPublished()) this.booksService.logBookViewed(bookId);

    return introPage;
  }

  async findPageById(id: number) {
    const page = await this.pageRepository.findOne({
      where: {id},
      relations: {choices: true},
      order: {choices: {order: "ASC"}},
    });
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    return page;
  }

  async updatePageById(id: number, updatePageDto: UpdatePageDto) {
    const page = await this.pageRepository.findOne({where: {id}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    Object.assign(page, updatePageDto);
    return this.pageRepository.save(page);
  }

  async updatePageOrder(id: number, order: number) {
    const page = await this.pageRepository.findOne({where: {id}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    const pagesInLane = await this.pageRepository.count({where: {laneId: page.laneId}});
    if (pagesInLane <= order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    await this.reorder("decrease", page.laneId, page.order + 1);
    await this.reorder("increase", page.laneId, order);
    Object.assign(page, {order});

    return this.pageRepository.save(page);
  }

  async updatePageLane(id: number, {laneId, order}: UpdatePageLaneDto) {
    const page = await this.pageRepository.findOne({where: {id}, relations: {lane: true}});
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

    await Promise.all([
      this.reorder("decrease", page.laneId, page.order + 1),
      this.reorder("increase", laneId, order),
    ]);
    const updatedPage = R.pipe(
      R.omit(["lane"]),
      R.assoc("laneId", laneId),
      R.assoc("order", order),
    )(page);

    return await this.pageRepository.save(updatedPage);
  }

  async deletePageById(id: number) {
    const page = await this.pageRepository.findOne({where: {id}, relations: {lane: true}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    if (page.isIntro()) throw new TextersHttpException("NO_EXPLICIT_INTRO_PAGE_DELETION");

    await Promise.all([
      this.choicesService.deleteChoicesByPageId(id),
      this.choicesService.deleteDestinationsByPageId(id),
      this.reorder("decrease", page.laneId, page.order),
    ]);
    await this.pageRepository.remove(page);
  }

  async isAuthor(memberId: number, pageId: number) {
    const page = await this.pageRepository.findOne({
      where: {id: pageId},
      relations: {book: true},
    });
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    return page.book.authorId === memberId;
  }

  async hasAnyPages(laneId: number) {
    return await this.pageRepository.exist({where: {laneId}});
  }

  async findLaneOrderById(id: number) {
    const page = await this.pageRepository.findOne({where: {id}, relations: {lane: true}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    return page.lane.order;
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

  private async reorder(type: "increase" | "decrease", laneId: number, from: number) {
    const setOrderQuery = () => (type === "increase" ? "order + 1" : "order - 1");
    await this.pageRepository
      .createQueryBuilder()
      .update()
      .set({order: setOrderQuery})
      .where({laneId})
      .andWhere("page.order >= :from", {from})
      .execute();
  }
}
