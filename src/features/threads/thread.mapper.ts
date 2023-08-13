import {MemberMapper} from "@/features/members/member.mapper";
import {Member} from "@/features/members/model/member.entity";
import {Thread} from "@/features/threads/model/thread.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class ThreadMapper {
  constructor(private readonly memberMapper: MemberMapper) {}

  toResponse(entity: Thread, member?: Pick<Member, "id" | "role" | "penName">) {
    const toAuthor = (member?: Member) => {
      if (!member) return null;
      return this.memberMapper.toAuthor(member);
    };
    const isAuthor = entity.author ? entity.author.id === member?.id : false;

    return R.pipe(
      R.evolve({author: toAuthor}),
      R.omit(["authorId", "password"]),
      R.assoc("isAuthor", isAuthor),
    )(entity);
  }
}
