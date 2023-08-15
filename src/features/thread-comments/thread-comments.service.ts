import {MemberReqPayload} from "@/features/members/model/member.entity";
import {CreateThreadCommentDto} from "@/features/thread-comments/model/create-thread-comment.dto";
import {ThreadComment} from "@/features/thread-comments/model/thread-comment.entity";
import {ThreadsService} from "@/features/threads/threads.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ThreadCommentsService {
  constructor(
    private readonly threadsService: ThreadsService,
    @InjectRepository(ThreadComment) private readonly commentsRepository: Repository<ThreadComment>,
  ) {}

  async createComment(
    boardId: string,
    threadId: number,
    createThreadCommentDto: CreateThreadCommentDto,
    member?: MemberReqPayload,
  ) {
    const thread = await this.threadsService.findThread(boardId, threadId, member);

    return member !== undefined
      ? await this.createAuthenticatedComment(thread.id, createThreadCommentDto, member)
      : await this.createUnauthenticatedComment(thread.id, createThreadCommentDto);
  }

  private async createAuthenticatedComment(
    threadId: number,
    {content}: CreateThreadCommentDto,
    member: MemberReqPayload,
  ) {
    const {id} = await this.commentsRepository.save(
      ThreadComment.fromAuthenticated(threadId, content, member),
    );
    return await this.commentsRepository.findOne({where: {id}, relations: {thread: true}});
  }

  private async createUnauthenticatedComment(
    threadId: number,
    {content, password}: CreateThreadCommentDto,
  ) {
    const {id} = await this.commentsRepository.save(
      ThreadComment.fromUnauthenticated(threadId, content, password),
    );
    return await this.commentsRepository.findOne({where: {id}, relations: {thread: true}});
  }
}
