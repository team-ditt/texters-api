import {BookFilteredView} from "@/features/books/model/book-filtered-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {CreateBookDto} from "@/features/books/model/create-book-request.dto";
import {UpdateBookDto} from "@/features/books/model/update-book-request.dto";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {FilesService} from "@/features/files/files.service";
import {LanesService} from "@/features/lanes/lanes.service";
import {PagesService} from "@/features/pages/pages.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class BooksService {
  constructor(
    private readonly filesService: FilesService,
    private readonly lanesService: LanesService,
    private readonly pagesService: PagesService,
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    @InjectRepository(BookFilteredView)
    private readonly filteredBooksRepository: Repository<BookFilteredView>,
  ) {}

  async createBook(authorId: number, createBookDto: CreateBookDto): Promise<Book> {
    const {title, description, coverImageId} = createBookDto;

    const book = Book.of(title, description);
    book.authorId = authorId;
    book.coverImage = await this.filesService.findById(coverImageId);

    const {id: bookId} = await this.booksRepository.save(book);
    const {id: laneId} = await this.lanesService.createIntroLane(bookId);
    await this.pagesService.createIntroPage(bookId, laneId);
    return await this.findBookById(bookId);
  }

  async findBookById(id: number): Promise<BookFilteredView> {
    const book = await this.filteredBooksRepository.findOne({
      where: {id},
      relations: {author: true, coverImage: true},
    });
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");
    return book;
  }

  async loadFlowChart(id: number) {
    return await this.booksRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .leftJoinAndSelect("book.coverImage", "coverImage")
      .leftJoinAndSelect("book.lanes", "lane")
      .leftJoinAndSelect("lane.pages", "page")
      .leftJoinAndSelect("page.choices", "choice")
      .where({id})
      .orderBy({
        "lane.order": "ASC",
        "page.order": "ASC",
        "choice.order": "ASC",
      })
      .getOne();
  }

  async updateBookById(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");

    Object.assign(book, updateBookDto);
    await this.booksRepository.save(book);

    return await this.findBookById(id);
  }

  async deleteBookById(id: number): Promise<void> {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");

    book.status = "DELETED";
    await this.booksRepository.save(book);
  }

  async isAuthor(memberId: number, bookId: number): Promise<boolean> {
    const book = await this.booksRepository.findOne({where: {id: bookId}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");
    return book.authorId === memberId;
  }
}
