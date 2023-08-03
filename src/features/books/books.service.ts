import {BookLikedService} from "@/features/book-liked/book-liked.service";
import {BookOrderBy, BookSearchParams} from "@/features/books/model/book-search.params";
import {BookTitleSearch} from "@/features/books/model/book-title-index.entity";
import {BookView} from "@/features/books/model/book-view.entity";
import {BookViewed} from "@/features/books/model/book-viewed.entity";
import {BookWeeklyViewedView} from "@/features/books/model/book-weekly-viewed-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {CreateBookDto} from "@/features/books/model/create-book.dto";
import {PublishedBookView} from "@/features/books/model/published-book-view.entity";
import {UpdateBookDto} from "@/features/books/model/update-book.dto";
import {Choice} from "@/features/choices/model/choice.entity";
import {EXCEPTIONS} from "@/features/exceptions/exceptions";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {FilesService} from "@/features/files/files.service";
import {File} from "@/features/files/model/file.entity";
import {LanesService} from "@/features/lanes/lanes.service";
import {Member} from "@/features/members/model/member.entity";
import {Page} from "@/features/pages/model/page.entity";
import {PagesService} from "@/features/pages/pages.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import * as R from "ramda";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class BooksService {
  constructor(
    private readonly filesService: FilesService,
    private readonly lanesService: LanesService,
    private readonly pagesService: PagesService,
    private readonly bookLikedService: BookLikedService,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookTitleSearch)
    private readonly bookTitleSearchRepository: Repository<BookTitleSearch>,
    @InjectRepository(BookView)
    private readonly bookViewRepository: Repository<BookView>,
    @InjectRepository(PublishedBookView)
    private readonly publishedBookViewRepository: Repository<PublishedBookView>,
    @InjectRepository(BookViewed)
    private readonly bookViewedRepository: Repository<BookViewed>,
    private readonly dataSource: DataSource,
  ) {}

  async createBook(authorId: number, createBookDto: CreateBookDto) {
    const {title, description, coverImageId} = createBookDto;

    const book = Book.of(title, description);
    book.authorId = authorId;
    if (coverImageId) book.coverImage = await this.filesService.findById(coverImageId);

    const {id: bookId} = await this.bookRepository.save(book);
    const {id: laneId} = await this.lanesService.createIntroLane(bookId);
    await this.pagesService.createIntroPage(bookId, laneId);
    return await this.findBookById(bookId);
  }

  async findBooksByAuthorId(authorId: number, page: number, limit: number) {
    const [books, totalCount] = await this.bookViewRepository.findAndCount({
      where: {authorId},
      relations: {author: true, coverImage: true, lanes: {pages: {choices: true}}},
      order: {updatedAt: "DESC"},
      take: limit,
      skip: (page - 1) * limit,
    });

    const refinedBooks = books.map(book => {
      const {canPublish, publishErrors} = this.validateCanPublish(book);

      return R.pipe(
        R.omit(["lanes"]),
        R.assoc("canPublish", canPublish),
        R.assoc("publishErrors", publishErrors),
      )(book);
    }) as (Book & {canPublish: boolean; publishErrors: string[]})[];

    return {books: refinedBooks, totalCount};
  }

  async findPublishedBooks({query, order, page, limit}: BookSearchParams) {
    const refinedQuery = query.toLowerCase().replace(/\s/g, "");
    const orderBy = (() => {
      switch (order) {
        case BookOrderBy.VIEWED:
          return "viewed";
        case BookOrderBy.LIKED:
          return "liked";
        case BookOrderBy.PUBLISHED_DATE:
          return "updatedAt";
      }
    })();

    const [books, totalCount] = await this.publishedBookViewRepository
      .createQueryBuilder("book")
      .leftJoin(BookTitleSearch, "bookTitleSearch", "book.id = bookTitleSearch.id")
      .leftJoinAndSelect("book.author", "member.books")
      .leftJoinAndSelect("book.coverImage", "file.book")
      .where("bookTitleSearch.index LIKE :likeQuery", {likeQuery: `%${refinedQuery}%`})
      .orderBy(`book.${orderBy}`, "DESC")
      .addOrderBy("book.title")
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {books, totalCount};
  }

  async findWeeklyMostViewedBooks(limit: number) {
    return await this.dataSource
      .createQueryBuilder()
      .from(PublishedBookView, "book")
      .leftJoin(BookWeeklyViewedView, "weekly", "book.id = weekly.id")
      .leftJoin(Member, "author", "book.authorId = author.id")
      .leftJoin(File, "coverImage", "book.coverImageId = coverImage.uuid")
      .select([
        "book.*",
        "author.id",
        "author.penName",
        "author.createdAt",
        "coverImage.directory",
        "coverImage.extension",
        'COALESCE(weekly.viewed::integer, 0) AS "weeklyViewed"',
      ])
      .orderBy('"weeklyViewed"', "DESC")
      .addOrderBy("book.title", "ASC")
      .limit(limit)
      .getRawMany();
  }

  async findBookById(id: number) {
    const book = await this.bookViewRepository.findOne({
      where: {id},
      relations: {author: true, coverImage: true},
    });
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");
    return book;
  }

  async loadFlowChart(id: number) {
    return await this.bookRepository
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
    const book = await this.bookRepository.findOne({where: {id}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");

    Object.assign(book, updateBookDto);
    await this.bookRepository.save(book);

    return await this.findBookById(id);
  }

  async publishBookById(id: number) {
    const book = await this.bookRepository.findOne({
      where: {id},
      relations: {lanes: {pages: {choices: true}}},
    });
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");
    if (book.isPublished()) throw new TextersHttpException("ALREADY_PUBLISHED");

    const {canPublish} = this.validateCanPublish(book);
    if (!canPublish) throw new TextersHttpException("CANNOT_PUBLISH");

    book.status = "PUBLISHED";
    await this.bookRepository.save(book);
    this.updateSearchIndex(book);

    return await this.findBookById(id);
  }

  async deleteBookById(id: number) {
    const book = await this.bookRepository.findOne({where: {id}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");

    await Promise.all([
      book.coverImageId ? this.filesService.deleteById(book.coverImageId) : null,
      this.bookRepository.remove(book),
      this.bookViewedRepository.delete({bookId: id}),
      this.bookLikedService.removeAllByBookId(id),
      this.bookTitleSearchRepository.delete({id}),
    ]);
  }

  async isAuthor(memberId: number, bookId: number) {
    const book = await this.bookRepository.findOne({where: {id: bookId}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");
    return book.authorId === memberId;
  }

  logBookViewed(bookId: number) {
    this.bookViewedRepository.save(BookViewed.of(bookId));
  }

  private validateCanPublish(book: Book | BookView) {
    const pages = book.lanes.flatMap(lane => lane.pages);
    const choices = pages.flatMap(page => page.choices);

    const allPagesHaveContent = pages.every(page => page.content);
    const allChoicesHaveDestination = choices.every(choice => choice.destinationPageId);
    const allPagesConnected = this.validateAllPagesConnected(pages, choices);

    const canPublish = allPagesHaveContent && allChoicesHaveDestination && allPagesConnected;
    const publishErrors = this.toPublishErrors({
      allPagesHaveContent,
      allChoicesHaveDestination,
      allPagesConnected,
    });

    return {canPublish, publishErrors};
  }

  private validateAllPagesConnected(pages: Page[], choices: Choice[]) {
    const uniqueDestinationPageCount = new Set(choices.map(choice => choice.destinationPageId))
      .size;
    return pages.length - 1 === uniqueDestinationPageCount;
  }

  private toPublishErrors(flags: {
    allPagesHaveContent: boolean;
    allChoicesHaveDestination: boolean;
    allPagesConnected: boolean;
  }) {
    const failedMessages = {
      allPagesHaveContent: EXCEPTIONS.NOT_ALL_PAGES_HAVE_CONTENT.message,
      allChoicesHaveDestination: EXCEPTIONS.NOT_ALL_CHOICES_HAVE_DESTINATION.message,
      allPagesConnected: EXCEPTIONS.NOT_ALL_PAGES_CONNECTED.message,
    };

    return R.pipe(
      R.pickBy(R.complement(R.identity)),
      R.keys,
      R.map(key => failedMessages[key]),
    )(flags);
  }

  private async updateSearchIndex(book: Book) {
    const index = book.title.toLowerCase().replace(/\s/g, "");
    await this.bookTitleSearchRepository.save(BookTitleSearch.of(book.id, index));
  }
}
