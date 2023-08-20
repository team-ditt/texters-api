import {BookStatisticsView} from "@/features/books/model/book-statistics-view.entity";
import {BookViewed} from "@/features/books/model/book-viewed.entity";
import {Book} from "@/features/books/model/book.entity";
import {CreateBookDto} from "@/features/books/model/create-book.dto";
import {UpdateBookDto} from "@/features/books/model/update-book.dto";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {FilesService} from "@/features/files/files.service";
import {LanesService} from "@/features/lanes/lanes.service";
import {PagesService} from "@/features/pages/pages.service";
import {PublishedBook} from "@/features/published-books/model/published-book.entity";
import {Inject, Injectable, forwardRef} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class BooksService {
  constructor(
    private readonly filesService: FilesService,
    @Inject(forwardRef(() => LanesService))
    private readonly lanesService: LanesService,
    @Inject(forwardRef(() => PagesService))
    private readonly pagesService: PagesService,
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    @InjectRepository(PublishedBook)
    private readonly publishedBooksRepository: Repository<PublishedBook>,
    @InjectRepository(BookViewed)
    private readonly bookViewedRepository: Repository<BookViewed>,
  ) {}

  async createBook(authorId: number, createBookDto: CreateBookDto) {
    const {title, description, coverImageId} = createBookDto;

    const book = Book.of(title, description);
    book.authorId = authorId;
    if (coverImageId) book.coverImage = await this.filesService.findById(coverImageId);

    const {id: bookId} = await this.booksRepository.save(book);
    const {id: laneId} = await this.lanesService.createIntroLane(bookId);
    await this.pagesService.createIntroPage(bookId, laneId);
    return await this.findBookById(bookId);
  }

  async findBooks(authorId: number, page: number, limit: number) {
    const totalCount = await this.booksRepository.count({where: {authorId}});
    const booksWithStatistics = await this.booksRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .leftJoinAndSelect("book.coverImage", "coverImage")
      .leftJoinAndSelect(BookStatisticsView, "bookStatistics", "book.id = bookStatistics.id")
      .leftJoin(PublishedBook, "published", "book.id = published.id")
      .addSelect("COALESCE(published.id IS NOT NULL, false)", "isPublished")
      .addSelect("COALESCE(book.updatedAt > published.publishedAt, false)", "canUpdate")
      .where("book.authorId = :authorId", {authorId})
      .orderBy("book.updatedAt", "DESC")
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany();

    return {booksWithStatistics, totalCount};
  }

  async findBookById(id: number) {
    const bookWithStatistics = await this.booksRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .leftJoinAndSelect("book.coverImage", "coverImage")
      .leftJoinAndSelect(BookStatisticsView, "bookStatistics", "book.id = bookStatistics.id")
      .leftJoin(PublishedBook, "published", "book.id = published.id")
      .addSelect("COALESCE(published.id IS NOT NULL, false)", "isPublished")
      .addSelect("COALESCE(book.updatedAt > published.publishedAt, false)", "canUpdate")
      .where("book.id = :id", {id})
      .getRawOne();

    if (!bookWithStatistics) throw new TextersHttpException("BOOK_NOT_FOUND");
    return bookWithStatistics;
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

  async updateBookById(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");

    Object.assign(book, updateBookDto);
    await this.booksRepository.save(book);

    return await this.findBookById(id);
  }

  async updateBookUpdatedAtToNow(id: number) {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book) return;

    book.updatedAt = new Date();
    await this.booksRepository.save(book);
  }

  async deleteBookById(id: number) {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");

    const publishedBook = await this.publishedBooksRepository.findOne({where: {id}});

    await Promise.all([
      book.coverImageId ? this.filesService.deleteById(book.coverImageId) : null,
      this.booksRepository.remove(book),
      this.publishedBooksRepository.remove(publishedBook),
    ]);
  }

  async isAuthor(memberId: number, bookId: number) {
    const book = await this.booksRepository.findOne({where: {id: bookId}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");
    return book.authorId === memberId;
  }

  logBookViewed(bookId: number) {
    this.bookViewedRepository.save(BookViewed.of(bookId));
  }
}
