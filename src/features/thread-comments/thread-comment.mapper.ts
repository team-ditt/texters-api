import {MemberReqPayload} from "@/features/members/model/member.entity";
import {ThreadComment} from "@/features/thread-comments/model/thread-comment.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class ThreadCommentMapper {
  toResponse(entity: ThreadComment, member?: MemberReqPayload) {
    const isThreadAuthor = entity.thread.authorId ? entity.thread.authorId === member?.id : false;
    const isCommenter = entity.commenterId ? entity.commenterId === member?.id : false;

    return R.pipe(
      R.omit(["commenter", "threadId", "thread", "password"]),
      R.assoc("isThreadAuthor", isThreadAuthor),
      R.assoc("isCommenter", isCommenter),
    )(entity);
  }
}
