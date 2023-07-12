import {BookFilteredView} from "@/features/books/model/book-filtered-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {MemberMapper} from "@/features/members/member.mapper";
import {Member} from "@/features/members/model/member.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class BookMapper {
  constructor(private readonly memberMapper: MemberMapper) {}

  toResponse(entity: Book | BookFilteredView) {
    const toAuthor = (member: Member) => this.memberMapper.toAuthor(member);
    const coverImageUrl = entity.coverImage?.toUrl ?? null;
    return R.pipe(
      R.evolve({author: toAuthor}),
      R.omit(["authorId", "coverImage"]),
      R.assoc("coverImageUrl", coverImageUrl),
    )(entity);
  }
}
