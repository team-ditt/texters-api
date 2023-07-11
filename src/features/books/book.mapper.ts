import {BookFilteredView} from "@/features/books/model/book-filtered-view.entity";
import {Book, BookStatus} from "@/features/books/model/book.entity";
import {AuthorDto, MemberMapper} from "@/features/members/member.mapper";
import {Member} from "@/features/members/model/member.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

type BookResponseDto = {
  id: number;
  author: AuthorDto;
  coverImageUrl: string | null;
  title: string;
  description: string;
  status: BookStatus;
  createdAt: Date;
  modifiedAt: Date;
};

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
