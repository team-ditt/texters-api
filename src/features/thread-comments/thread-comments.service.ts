import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {MemberReqPayload} from "@/features/members/model/member.entity";
import {CreateThreadCommentDto} from "@/features/thread-comments/model/create-thread-comment.dto";
import {ThreadComment} from "@/features/thread-comments/model/thread-comment.entity";
import {UpdateThreadCommentDto} from "@/features/thread-comments/model/update-thread-comment.dto";
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

  async authorizePassword(threadId: number, commentId: number, password: string) {
    const comment = await this.commentsRepository.findOne({where: {id: commentId, threadId}});
    if (!comment) throw new TextersHttpException("COMMENT_NOT_FOUND");
    if (!comment.validatePassword(password))
      throw new TextersHttpException("WRONG_COMMENT_PASSWORD");
  }

  async findComments(threadId: number, page: number, limit: number) {
    const [comments, totalCount] = await this.commentsRepository.findAndCount({
      where: {threadId},
      relations: {thread: true},
      take: limit,
      skip: (page - 1) * limit,
      order: {createdAt: "DESC"},
    });

    return {comments, totalCount};
  }

  async updateComment(
    threadId: number,
    commentId: number,
    {content, password}: UpdateThreadCommentDto,
    member?: MemberReqPayload,
  ) {
    const comment = await this.commentsRepository.findOne({where: {id: commentId, threadId}});
    if (!comment) throw new TextersHttpException("COMMENT_NOT_FOUND");

    return member !== undefined
      ? await this.updateAuthenticatedComment(comment, content, member)
      : await this.updateUnauthenticatedComment(comment, content, password);
  }

  async deleteComment(
    threadId: number,
    commentId: number,
    password?: string,
    member?: MemberReqPayload,
  ) {
    const comment = await this.commentsRepository.findOne({where: {id: commentId, threadId}});
    if (!comment) throw new TextersHttpException("COMMENT_NOT_FOUND");

    member !== undefined
      ? await this.deleteAuthenticatedComment(comment, member)
      : await this.deleteUnauthenticatedComment(comment, password);
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

  private async updateAuthenticatedComment(
    comment: ThreadComment,
    content: string,
    member: MemberReqPayload,
  ) {
    const isAdmin = member?.role === "ROLE_ADMIN";
    const isCommenter = comment.commenterId && comment.commenterId === member.id;
    if (!isAdmin && !isCommenter) throw new TextersHttpException("NOT_AUTHOR_OF_THREAD_COMMENT");

    comment.content = content;
    const {id} = await this.commentsRepository.save(comment);
    return await this.commentsRepository.findOne({where: {id}, relations: {thread: true}});
  }

  private async updateUnauthenticatedComment(
    comment: ThreadComment,
    content: string,
    password?: string,
  ) {
    if (password === undefined || !comment.validatePassword(password))
      throw new TextersHttpException("NOT_AUTHOR_OF_THREAD");

    comment.content = content;
    const {id} = await this.commentsRepository.save(comment);
    return await this.commentsRepository.findOne({where: {id}, relations: {thread: true}});
  }

  private async deleteAuthenticatedComment(comment: ThreadComment, member: MemberReqPayload) {
    const isAdmin = member?.role === "ROLE_ADMIN";
    const isCommenter = comment.commenterId && comment.commenterId === member.id;
    if (!isAdmin && !isCommenter) throw new TextersHttpException("NOT_AUTHOR_OF_THREAD_COMMENT");

    await this.commentsRepository.remove(comment);
  }

  private async deleteUnauthenticatedComment(comment: ThreadComment, password?: string) {
    if (password === undefined || !comment.validatePassword(password))
      throw new TextersHttpException("NOT_AUTHOR_OF_THREAD_COMMENT");

    await this.commentsRepository.remove(comment);
  }
}
