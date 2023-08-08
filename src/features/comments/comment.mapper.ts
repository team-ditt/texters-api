import {Comment} from "@/features/comments/model/comment.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class CommentMapper {
  toResponse(entity: Comment, currentMemberId?: number) {
    const isAuthor = entity.book.author.id === entity.commenterId;
    const isCommenter = !!currentMemberId && entity.commenter?.id === currentMemberId;

    return R.pipe(
      R.omit(["commenterId", "commenter", "bookId", "book"]),
      R.assoc("isAuthor", isAuthor),
      R.assoc("isCommenter", isCommenter),
    )(entity);
  }
}
