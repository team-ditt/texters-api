import {MemberMapper} from "@/features/members/member.mapper";
import {MemberReqPayload} from "@/features/members/model/member.entity";
import {Thread} from "@/features/threads/model/thread.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class ThreadMapper {
  constructor(private readonly memberMapper: MemberMapper) {}

  toResponse(entity: Thread, member?: MemberReqPayload) {
    const isAuthor = entity.authorId ? entity.authorId === member?.id : false;

    return R.pipe(
      R.omit(["author", "boardId", "board", "password"]),
      R.assoc("isAuthor", isAuthor),
    )(entity);
  }
}
