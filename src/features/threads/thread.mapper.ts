import {MemberReqPayload} from "@/features/members/model/member.entity";
import {ThreadView} from "@/features/threads/model/thread-view.entity";
import {Thread} from "@/features/threads/model/thread.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class ThreadMapper {
  toResponse(entity: Thread | ThreadView, member?: MemberReqPayload) {
    const isAuthor = entity.authorId ? entity.authorId === member?.id : false;
    const canViewHiddenThread = isAuthor || member?.role === "ROLE_ADMIN";
    const toRefinedContent = (content: string) =>
      entity.isHidden && !canViewHiddenThread
        ? "비밀글은 작성자와 운영자만 볼 수 있어요!"
        : content;

    return R.pipe(
      R.omit(["author", "boardId", "board", "password"]),
      R.evolve({content: toRefinedContent}),
      R.assoc("isAuthor", isAuthor),
    )(entity);
  }
}
