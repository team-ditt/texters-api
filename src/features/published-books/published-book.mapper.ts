import {BookStatisticsView} from "@/features/books/model/book-statistics-view.entity";
import {File} from "@/features/files/model/file.entity";
import {MemberMapper} from "@/features/members/member.mapper";
import {Member} from "@/features/members/model/member.entity";
import {PublishedBook} from "@/features/published-books/model/published-book.entity";
import {ObjectUtils} from "@/utils";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class PublishedBookMapper {
  constructor(private readonly memberMapper: MemberMapper) {}

  toResponseFromBookWithStatistics(raw: any) {
    const book = ObjectUtils.filterPropsBy("book_")(raw) as PublishedBook;
    const author = this.memberMapper.toAuthor(ObjectUtils.filterPropsBy("author_")(raw) as Member);
    const coverImageUrl = book.coverImageId
      ? File.toUrl({
          uuid: book.coverImageId,
          directory: raw["coverImage_directory"],
          extension: raw["coverImage_extension"],
        } as File)
      : null;
    const statistics = ObjectUtils.filterPropsBy("bookStatistics_")(raw) as BookStatisticsView;

    return R.pipe(
      R.omit(["authorId", "coverImageId"]),
      R.assoc("author", author),
      R.assoc("coverImageUrl", coverImageUrl),
      R.assoc("viewed", statistics.viewed),
      R.assoc("liked", statistics.liked),
      R.assoc("commentsCount", statistics.commentsCount),
    )(book);
  }

  toResponseFromWeeklyView(raw: any) {
    const book = ObjectUtils.filterPropsBy("book_")(raw) as PublishedBook;
    const author = this.memberMapper.toAuthor(ObjectUtils.filterPropsBy("author_")(raw) as Member);
    const coverImageUrl = book.coverImageId
      ? File.toUrl({
          uuid: book.coverImageId,
          directory: raw["coverImage_directory"],
          extension: raw["coverImage_extension"],
        } as File)
      : null;

    return R.pipe(
      R.omit(["authorId", "coverImageId"]),
      R.assoc("author", author),
      R.assoc("coverImageUrl", coverImageUrl),
      R.assoc("weeklyViewed", raw.weeklyViewed),
    )(book);
  }
}
