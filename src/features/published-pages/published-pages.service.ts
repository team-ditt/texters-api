import {BooksService} from "@/features/books/books.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {PublishedPage} from "@/features/published-pages/model/published-page.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class PublishedPagesService {
  constructor(
    private readonly booksService: BooksService,
    @InjectRepository(PublishedPage)
    private readonly publishedPagesRepository: Repository<PublishedPage>,
  ) {}

  async findIntroPage(bookId: number) {
    const introPage = await this.publishedPagesRepository.findOne({
      where: {bookId, isIntro: true},
      relations: {choices: true},
      order: {choices: {order: "ASC"}},
    });
    if (!introPage) throw new TextersHttpException("PAGE_NOT_FOUND");

    this.booksService.logBookViewed(bookId);
    return introPage;
  }

  async findPageById(id: number) {
    const page = await this.publishedPagesRepository.findOne({
      where: {id},
      relations: {choices: true},
      order: {choices: {order: "ASC"}},
    });
    if (!page) throw new TextersHttpException("PAGE_NOT_FOUND");
    return page;
  }
}
