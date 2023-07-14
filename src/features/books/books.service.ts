import {BookTitleSearch} from "@/features/books/model/book-title-index.entity";
import {BookViewed} from "@/features/books/model/book-viewed.entity";
import {Book} from "@/features/books/model/book.entity";
import {CreateBookDto} from "@/features/books/model/create-book-request.dto";
import {FilteredBookView} from "@/features/books/model/filtered-book-view.entity";
import {UpdateBookDto} from "@/features/books/model/update-book-request.dto";
import {Choice} from "@/features/choices/model/choice.entity";
import {EXCEPTIONS} from "@/features/exceptions/exceptions";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {FilesService} from "@/features/files/files.service";
import {LanesService} from "@/features/lanes/lanes.service";
import {Page} from "@/features/pages/model/page.entity";
import {PagesService} from "@/features/pages/pages.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import * as R from "ramda";
import {Repository} from "typeorm";

@Injectable()
export class BooksService {
  constructor(
    private readonly filesService: FilesService,
    private readonly lanesService: LanesService,
    private readonly pagesService: PagesService,
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    @InjectRepository(BookTitleSearch)
    private readonly bookTitleSearchRepository: Repository<BookTitleSearch>,
    @InjectRepository(FilteredBookView)
    private readonly filteredBooksRepository: Repository<FilteredBookView>,
    @InjectRepository(BookViewed)
    private readonly bookViewedRepository: Repository<BookViewed>,
  ) {}

  async createBook(authorId: number, createBookDto: CreateBookDto) {
    const {title, description, coverImageId} = createBookDto;

    const book = Book.of(title, description);
    book.authorId = authorId;
    book.coverImage = await this.filesService.findById(coverImageId);

    const {id: bookId} = await this.booksRepository.save(book);
    const {id: laneId} = await this.lanesService.createIntroLane(bookId);
    await this.pagesService.createIntroPage(bookId, laneId);
    return await this.findBookById(bookId);
  }

  async findBooksByAuthorId(authorId: number, page: number, limit: number) {
    const [books, totalCount] = await this.filteredBooksRepository.findAndCount({
      where: {authorId},
      relations: {author: true, coverImage: true, lanes: {pages: {choices: true}}},
      order: {modifiedAt: "DESC"},
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

  async findBookById(id: number) {
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

  async updateBookById(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book || book.isDeleted()) throw new TextersHttpException("BOOK_NOT_FOUND");

    Object.assign(book, updateBookDto);
    await this.booksRepository.save(book);

    return await this.findBookById(id);
  }

  async publishBookById(id: number) {
    const book = await this.booksRepository.findOne({
      where: {id},
      relations: {lanes: {pages: {choices: true}}},
    });
    if (!book || book.isDeleted()) throw new TextersHttpException("BOOK_NOT_FOUND");
    if (book.isPublished()) throw new TextersHttpException("ALREADY_PUBLISHED");

    const {canPublish} = this.validateCanPublish(book);
    if (!canPublish) throw new TextersHttpException("CANNOT_PUBLISH");

    book.status = "PUBLISHED";
    await this.booksRepository.save(book);
    this.updateSearchIndex(book);

    return await this.findBookById(id);
  }

  async deleteBookById(id: number) {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book || book.isDeleted()) throw new TextersHttpException("BOOK_NOT_FOUND");

    if (book.isPublished()) this.bookTitleSearchRepository.delete({id: book.id});
    book.status = "DELETED";
    await this.booksRepository.save(book);
  }

  async isAuthor(memberId: number, bookId: number) {
    const book = await this.booksRepository.findOne({where: {id: bookId}});
    if (!book || book.isDeleted()) throw new TextersHttpException("BOOK_NOT_FOUND");
    return book.authorId === memberId;
  }

  logBookViewed(bookId: number) {
    this.bookViewedRepository.save(BookViewed.of(bookId));
  }

  private validateCanPublish(book: Book | FilteredBookView) {
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
