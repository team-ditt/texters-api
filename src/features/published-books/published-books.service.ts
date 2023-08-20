import {BookStatisticsView} from "@/features/books/model/book-statistics-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {BookOrderBy, BookSearchParams} from "@/features/published-books/model/book-search.params";
import {BookWeeklyViewedView} from "@/features/published-books/model/book-weekly-viewed-view.entity";
import {PublishedBookTitleSearch} from "@/features/published-books/model/published-book-title-index.entity";
import {PublishedBook} from "@/features/published-books/model/published-book.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class PublishedBooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(PublishedBook)
    private readonly publishedBooksRepository: Repository<PublishedBook>,
    @InjectRepository(PublishedBookTitleSearch)
    private readonly publishedBookTitleSearchRepository: Repository<PublishedBookTitleSearch>,
  ) {}

  async findPublishedBooks({query, order, page, limit}: BookSearchParams) {
    const refinedQuery = query.toLowerCase().replace(/\s/g, "");
    const orderBy = (() => {
      switch (order) {
        case BookOrderBy.VIEWED:
          return "bookStatistics.viewed";
        case BookOrderBy.LIKED:
          return "bookStatistics.liked";
        case BookOrderBy.PUBLISHED_DATE:
          return "book.publishedAt";
      }
    })();

    const totalCount = await this.publishedBooksRepository
      .createQueryBuilder("book")
      .leftJoin(PublishedBookTitleSearch, "bookTitleSearch", "book.id = bookTitleSearch.id")
      .where("bookTitleSearch.index LIKE :likeQuery", {likeQuery: `%${refinedQuery}%`})
      .getCount();

    const booksWithStatistics = await this.publishedBooksRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .leftJoinAndSelect("book.coverImage", "coverImage")
      .leftJoinAndSelect(BookStatisticsView, "bookStatistics", "book.id = bookStatistics.id")
      .leftJoin(PublishedBookTitleSearch, "bookTitleSearch", "book.id = bookTitleSearch.id")
      .where("bookTitleSearch.index LIKE :likeQuery", {likeQuery: `%${refinedQuery}%`})
      .orderBy(orderBy, "DESC")
      .addOrderBy("book.title")
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany();

    return {booksWithStatistics, totalCount};
  }

  async findWeeklyMostViewedBooks(limit: number) {
    return await this.publishedBooksRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .leftJoinAndSelect("book.coverImage", "coverImage")
      .leftJoin(BookWeeklyViewedView, "weekly", "book.id = weekly.id")
      .addSelect(['COALESCE(weekly.viewed::integer, 0) AS "weeklyViewed"'])
      .orderBy('"weeklyViewed"', "DESC")
      .addOrderBy("book.title", "ASC")
      .limit(limit)
      .getRawMany();
  }

  async findPublishedBookById(id: number) {
    const bookWithStatistic = await this.publishedBooksRepository
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .leftJoinAndSelect("book.coverImage", "coverImage")
      .leftJoinAndSelect(BookStatisticsView, "bookStatistics", "book.id = bookStatistics.id")
      .getRawOne();
    if (!bookWithStatistic) throw new TextersHttpException("BOOK_NOT_FOUND");
    return bookWithStatistic;
  }

  async publishBookById(id: number) {
    const book = await this.booksRepository.findOne({
      where: {id},
      relations: {author: true, coverImage: true, lanes: {pages: {choices: true}}},
    });
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");

    const didPublishBookBefore = await this.publishedBooksRepository.exist({where: {id}});
    if (didPublishBookBefore) await this.unpublishBookById(id);

    const publishedBook = PublishedBook.from(book);
    await this.publishedBooksRepository.save(publishedBook);
    await this.updateSearchIndex(publishedBook);
    return await this.findPublishedBookById(id);
  }

  async unpublishBookById(id: number) {
    const book = await this.publishedBooksRepository.findOne({where: {id}});
    if (!book) throw new TextersHttpException("BOOK_NOT_FOUND");
    await this.publishedBooksRepository.remove(book);
  }

  private async updateSearchIndex(book: PublishedBook) {
    const index = book.title.toLowerCase().replace(/\s/g, "");
    await this.publishedBookTitleSearchRepository.save(PublishedBookTitleSearch.of(book.id, index));
  }
}
