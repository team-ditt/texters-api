import {BookView} from "@/features/books/model/book-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {PublishedBookView} from "@/features/books/model/published-book-view.entity";
import {MemberMapper} from "@/features/members/member.mapper";
import {Member} from "@/features/members/model/member.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class BookMapper {
  constructor(private readonly memberMapper: MemberMapper) {}

  toResponse(entity: Book | BookView | PublishedBookView) {
    const toAuthor = (member: Member) => this.memberMapper.toAuthor(member);
    const coverImageUrl = entity.coverImage?.toUrl() ?? null;
    return R.pipe(
      R.evolve({author: toAuthor}),
      R.omit(["authorId", "coverImage"]),
      R.assoc("coverImageUrl", coverImageUrl),
    )(entity);
  }
}
