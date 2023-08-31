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
    const lane = await this.lanesService.findLaneWithPagesById(laneId);
    if (lane.pages.length < order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    lane.pages.splice(order, 0, Page.of(bookId, laneId, title, order));
    const pages = await Promise.all(
      lane.pages.map((page, order) => {
        page.order = order;
        return this.pageRepository.save(page);
      }),
    );
    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return pages[order];
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

    const lane = await this.lanesService.findLaneWithPagesById(page.laneId);
    if (lane.pages.length <= order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    lane.pages.splice(page.order, 1);
    lane.pages.splice(order, 0, page);
    const pages = await this.reorder(lane.pages);

    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return pages[order];
  }

  async updatePageLane(bookId: number, pageId: number, {laneId, order}: UpdatePageLaneDto) {
    const page = await this.pageRepository.findOne({where: {id: pageId}, relations: {lane: true}});
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    if (page.laneId === laneId) return this.updatePageOrder(bookId, pageId, order);

    const targetLane = await this.lanesService.findLaneWithPagesById(laneId);
    if (!targetLane) throw new TextersHttpException("LANE_NOT_FOUND");
    if (targetLane.pages.length < order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    const updatedPage = R.pipe(
      R.omit(["lane"]),
      R.assoc("laneId", laneId),
      R.assoc("order", order),
    )(page) as Page;
    targetLane.pages.splice(order, 0, updatedPage);

    const originalLane = await this.lanesService.findLaneWithPagesById(page.laneId);
    originalLane.pages.splice(page.order, 1);

    const pages = await this.reorder(targetLane.pages);
    await this.reorder(originalLane.pages);

    await this.booksService.updateBookUpdatedAtToNow(bookId);
    return pages[order];
  }

  async deletePage(bookId: number, pageId: number) {
    const page = await this.pageRepository.findOne({
      where: {id: pageId},
      relations: {lane: {pages: true}},
    });
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");

    if (page.isIntro) throw new TextersHttpException("NO_EXPLICIT_INTRO_PAGE_DELETION");

    page.lane.pages.splice(page.order, 1);
    await Promise.all([
      this.reorder(page.lane.pages),
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

  private async reorder(pages: Page[]) {
    return await Promise.all(
      pages.map((page, order) => {
        page.order = order;
        return this.pageRepository.save(page);
      }),
    );
  }
}
