import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Lane} from "@/features/lanes/model/lane.entity";
import {PagesService} from "@/features/pages/pages.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class LanesService {
  constructor(
    private readonly pagesService: PagesService,
    @InjectRepository(Lane) private readonly lanesRepository: Repository<Lane>,
  ) {}

  async createIntroLane(bookId: number) {
    return await this.lanesRepository.save(Lane.of(bookId, 0));
  }

  async createLane(bookId: number, order: number) {
    if (order === 0) throw new TextersHttpException("NO_EXPLICIT_INTRO_LANE_MODIFICATION");

    const lanes = await this.lanesRepository.find({where: {bookId}, order: {order: "ASC"}});
    if (lanes.length < order) throw new TextersHttpException("ORDER_INDEX_OUT_OF_BOUND");

    const newLane = Lane.of(bookId, order);
    lanes.splice(order, 0, newLane);
    this.updateOrders(lanes);
    await this.saveLanes(lanes);

    return newLane;
  }

  private updateOrders(lanes: Lane[]) {
    lanes.forEach((lane, index) => (lane.order = index));
  }

  private async saveLanes(lanes: Lane[]) {
    await Promise.all(lanes.map(async lane => this.lanesRepository.save(lane)));
  }

  async deleteLaneById(id: number) {
    const lane = await this.lanesRepository.findOne({where: {id}});
    const lanes = await this.lanesRepository.find({
      where: {bookId: lane.bookId},
      order: {order: "ASC"},
    });

    if (lane.order === 0) throw new TextersHttpException("NO_EXPLICIT_INTRO_LANE_MODIFICATION");

    const hasAnyPages = this.pagesService.hasAnyPages(lane.id);
    if (hasAnyPages) throw new TextersHttpException("NOT_EMPTY_LANE");

    lanes.splice(lane.order, 1);
    this.updateOrders(lanes);

    await this.saveLanes(lanes);
    await this.lanesRepository.remove(lane);
  }

  async isAuthor(memberId: number, laneId: number) {
    const lane = await this.lanesRepository.findOne({
      where: {id: laneId},
      relations: ["book"],
    });
    if (!lane) throw new TextersHttpException("PAGE_NOT_FOUND");
    return lane.book.authorId === memberId;
  }
}
