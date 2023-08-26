import {BookStatisticsView} from "@/features/books/model/book-statistics-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {File} from "@/features/files/model/file.entity";
import {MemberMapper} from "@/features/members/member.mapper";
import {Member} from "@/features/members/model/member.entity";
import {ObjectUtils} from "@/utils";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class BookMapper {
  constructor(private readonly memberMapper: MemberMapper) {}

  toResponse(entity: Book) {
    const toAuthor = (member: Member) => this.memberMapper.toAuthor(member);
    const coverImageUrl = entity.coverImage?.toUrl() ?? null;
    return R.pipe(
      R.evolve({author: toAuthor}),
      R.omit(["authorId", "coverImage", "coverImageId"]),
      R.assoc("coverImageUrl", coverImageUrl),
    )(entity);
  }

  toResponseFromBookWithStatistics(raw: any) {
    const book = ObjectUtils.filterPropsBy("book_")(raw) as Book;
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
      R.assoc("isPublished", raw.isPublished),
      R.assoc("canUpdate", raw.canUpdate),
    )(book);
  }
}
