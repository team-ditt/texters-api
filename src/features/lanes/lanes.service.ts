import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Lane} from "@/features/lanes/model/lane.entity";
import {PagesService} from "@/features/pages/pages.service";
import {Inject, Injectable, forwardRef} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class LanesService {
  constructor(
    @Inject(forwardRef(() => PagesService))
    private readonly pagesService: PagesService,
    @InjectRepository(Lane) private readonly laneRepository: Repository<Lane>,
  ) {}

  async createIntroLane(bookId: number) {
    return await this.laneRepository.save(Lane.of(bookId, 0));
  }

  async createLane(bookId: number, order: number) {
    if (order === 0) throw new TextersHttpException("NO_EXPLICIT_INTRO_LANE_MODIFICATION");

    const lanes = await this.laneRepository.find({where: {bookId}, order: {order: "ASC"}});
    if (lanes.length < order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    await this.reorder("increase", bookId, order);
    return await this.laneRepository.save(Lane.of(bookId, order));
  }

  async deleteLaneById(id: number) {
    const lane = await this.laneRepository.findOne({where: {id}});
    if (lane.isIntro()) throw new TextersHttpException("NO_EXPLICIT_INTRO_LANE_MODIFICATION");

    const hasAnyPages = await this.pagesService.hasAnyPages(lane.id);
    if (hasAnyPages) throw new TextersHttpException("NOT_EMPTY_LANE");

    await Promise.all([
      this.reorder("decrease", lane.bookId, lane.order + 1),
      this.laneRepository.remove(lane),
    ]);
  }

  async isAuthor(memberId: number, laneId: number) {
    const lane = await this.laneRepository.findOne({
      where: {id: laneId},
      relations: {book: true},
    });
    if (!lane) throw new TextersHttpException("PAGE_NOT_FOUND");
    return lane.book.authorId === memberId;
  }

  async findLaneWithPagesById(id: number) {
    return this.laneRepository.findOne({where: {id}, relations: {pages: true}});
  }

  private async reorder(type: "increase" | "decrease", bookId: number, from: number) {
    const setOrderQuery = () => (type === "increase" ? "order + 1" : "order - 1");
    await this.laneRepository
      .createQueryBuilder()
      .update()
      .set({order: setOrderQuery})
      .where({bookId})
      .andWhere("lane.order >= :from", {from})
      .execute();
  }
}
