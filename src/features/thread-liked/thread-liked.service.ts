import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {MemberReqPayload} from "@/features/members/model/member.entity";
import {ThreadLiked} from "@/features/thread-liked/model/thread-liked.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Between, IsNull, Repository} from "typeorm";

@Injectable()
export class ThreadLikedService {
  constructor(
    @InjectRepository(ThreadLiked) private readonly threadLikedRepository: Repository<ThreadLiked>,
  ) {}

  async increaseThreadLiked(threadId: number, ip: string, member?: MemberReqPayload) {
    return member !== undefined
      ? await this.increaseAuthenticatedThreadLiked(threadId, ip, member)
      : await this.increaseUnauthenticatedThreadLiked(threadId, ip);
  }

  private async increaseAuthenticatedThreadLiked(
    threadId: number,
    ip: string,
    member: MemberReqPayload,
  ) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hasRecordIn24Hours = await this.threadLikedRepository.exist({
      where: {threadId, memberId: member.id, createdAt: Between(yesterday, new Date())},
    });
    if (hasRecordIn24Hours) throw new TextersHttpException("THREAD_LIKED_IN_PAST_24_HOURS");
    await this.threadLikedRepository.save(ThreadLiked.of(ip, threadId, member.id));
  }

  private async increaseUnauthenticatedThreadLiked(threadId: number, ip: string) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hasRecordIn24Hours = await this.threadLikedRepository.exist({
      where: {threadId, ip, memberId: IsNull(), createdAt: Between(yesterday, new Date())},
    });
    if (hasRecordIn24Hours) throw new TextersHttpException("THREAD_LIKED_IN_PAST_24_HOURS");
    await this.threadLikedRepository.save(ThreadLiked.of(ip, threadId));
  }
}
