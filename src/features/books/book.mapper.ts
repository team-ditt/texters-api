import {BookFilteredView} from "@/features/books/model/book-filtered-view.entity";
import {Book, BookStatus} from "@/features/books/model/book.entity";
import {AuthorDto, MemberMapper} from "@/features/members/member.mapper";
import {Injectable} from "@nestjs/common";

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

  toResponse(entity: Book | BookFilteredView): BookResponseDto {
    const {id, author, coverImage, title, description, status, createdAt, modifiedAt} = entity;
    return {
      id,
      author: this.memberMapper.toAuthor(author),
      coverImageUrl: coverImage?.toUrl() ?? null,
      title,
      description,
      status,
      createdAt,
      modifiedAt,
    };
  }
}
