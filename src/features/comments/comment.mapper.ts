import {Comment} from "@/features/comments/model/comment.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class CommentMapper {
  toResponse(currentMemberId: number, entity: Comment) {
    const isAuthor = entity.book.author.id === currentMemberId;
    const isCommenter = entity.commenter?.id === currentMemberId;

    return R.pipe(
      R.omit(["commenterId", "commenter", "bookId", "book"]),
      R.assoc("isAuthor", isAuthor),
      R.assoc("isCommenter", isCommenter),
    )(entity);
  }
}
