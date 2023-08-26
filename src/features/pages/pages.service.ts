import {BooksService} from "@/features/books/books.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {LanesService} from "@/features/lanes/lanes.service";
import {CreatePageDto} from "@/features/pages/model/create-page.dto";
import {Page} from "@/features/pages/model/page.entity";
import {UpdatePageLaneDto} from "@/features/pages/model/update-page-lane.dto";
import {UpdatePageDto} from "@/features/pages/model/update-page.dto";
import {Inject, Injectable, forwardRef} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import * as R from "ramda";
import {Repository} from "typeorm";

@Injectable()
export class PagesService {
  constructor(
    @Inject(forwardRef(() => BooksService))
    private readonly booksService: BooksService,
    @Inject(forwardRef(() => LanesService))
    private readonly lanesService: LanesService,
    @InjectRepository(Page) private readonly pageRepository: Repository<Page>,
  ) {}

  async createIntroPage(bookId: number, laneId: number) {
    const INTRO_PAGE_TITLE = "페이지 제목을 입력해 주세요";
    return await this.pageRepository.save(Page.of(bookId, laneId, INTRO_PAGE_TITLE, 0, true));
  }

  async createPage(bookId: number, laneId: number, {title, order}: CreatePageDto) {
    const pagesInLane = await this.pageRepository.count({where: {laneId}});
    if (pagesInLane < order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    await this.reorder("increase", laneId, order);
    const page = await this.pageRepository.save(Page.of(bookId, laneId, title, pagesInLane));
    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return page;
  }

  async findIntroPage(bookId: number) {
    const introPage = await this.pageRepository.findOne({
      where: {bookId, isIntro: true},
      relations: {choices: true},
      order: {choices: {order: "ASC"}},
    });
    if (!introPage) throw new TextersHttpException("PAGE_NOT_FOUND");

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

  async updatePage(bookId: number, pageId: number, updatePageDto: UpdatePageDto) {
    const page = await this.pageRepository.findOne({where: {id: pageId}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    Object.assign(page, updatePageDto);
    await this.pageRepository.save(page);
    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return page;
  }

  async updatePageOrder(bookId: number, pageId: number, order: number) {
    const page = await this.pageRepository.findOne({where: {id: pageId}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    const pagesInLane = await this.pageRepository.count({where: {laneId: page.laneId}});
    if (pagesInLane <= order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    await this.reorder("decrease", page.laneId, page.order + 1);
    await this.reorder("increase", page.laneId, order);
    Object.assign(page, {order});

    await this.pageRepository.save(page);
    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return page;
  }

  async updatePageLane(bookId: number, pageId: number, {laneId, order}: UpdatePageLaneDto) {
    const page = await this.pageRepository.findOne({where: {id: pageId}, relations: {lane: true}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    const targetLane = await this.lanesService.findLaneWithPagesById(laneId);
    if (!targetLane) throw new TextersHttpException("LANE_NOT_FOUND");
    if (targetLane.pages.length < order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    await Promise.all([
      this.reorder("decrease", page.laneId, page.order + 1),
      this.reorder("increase", laneId, order),
    ]);
    const updatedPage = R.pipe(
      R.omit(["lane"]),
      R.assoc("laneId", laneId),
      R.assoc("order", order),
    )(page);

    await this.pageRepository.save(updatedPage);
    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return updatedPage;
  }

  async deletePage(bookId: number, pageId: number) {
    const page = await this.pageRepository.findOne({where: {id: pageId}, relations: {lane: true}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    if (page.isIntro) throw new TextersHttpException("NO_EXPLICIT_INTRO_PAGE_DELETION");

    await this.reorder("decrease", page.laneId, page.order);
    await Promise.all([
      this.pageRepository.remove(page),
      this.booksService.updateBookUpdatedAtToNow(bookId),
    ]);
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
