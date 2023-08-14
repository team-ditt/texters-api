import {BoardsService} from "@/features/boards/boards.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {MemberReqPayload} from "@/features/members/model/member.entity";
import {CreateThreadDto} from "@/features/threads/model/create-thread.dto";
import {
  ThreadOrderBy,
  ThreadSearchParams,
  ThreadType,
} from "@/features/threads/model/thread-search.params";
import {Thread} from "@/features/threads/model/thread.entity";
import {UpdateThreadDto} from "@/features/threads/model/update-thread.dto";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import * as R from "ramda";
import {Repository} from "typeorm";

@Injectable()
export class ThreadsService {
  constructor(
    private readonly boardsService: BoardsService,
    @InjectRepository(Thread) private readonly threadsRepository: Repository<Thread>,
  ) {}

  async createThread(boardId: string, createThreadDto: CreateThreadDto, member?: MemberReqPayload) {
    if (!(await this.boardsService.existsById(boardId)))
      throw new TextersHttpException("BOARD_NOT_FOUND");
    if (createThreadDto.isFixed && member?.role !== "ROLE_ADMIN")
      throw new TextersHttpException("NOT_AUTHORIZED_MEMBER");

    return member !== undefined
      ? await this.createAuthenticatedThread(boardId, createThreadDto, member)
      : await this.createUnauthenticatedThread(boardId, createThreadDto);
  }

  async authorizePassword(boardId: string, threadId: number, password: string) {
    const thread = await this.threadsRepository.findOne({where: {id: threadId, boardId}});
    if (!thread) throw new TextersHttpException("THREAD_NOT_FOUND");
    if (!thread.validatePassword(password)) throw new TextersHttpException("WRONG_THREAD_PASSWORD");
  }

  async findThreads(boardId: string, {type, order, page, limit}: ThreadSearchParams) {
    const shouldFilterFixed = type === ThreadType.FIXED;
    const orderBy = (() => {
      switch (order) {
        case ThreadOrderBy.CREATED_AT:
          return "createdAt";
        // FIXME: activate below condition after adding thread like feature
        // case ThreadOrderBy.LIKED: return 'liked';
      }
    })();

    // FIXME: replace below with threads view after implementing comments, like feature
    const [threads, totalCount] = await this.threadsRepository.findAndCount({
      where: {boardId, ...(shouldFilterFixed && {isFixed: true})},
      relations: {author: true},
      take: limit,
      skip: (page - 1) * limit,
      order: {[orderBy]: "DESC"},
    });

    return {threads, totalCount};
  }

  async findThread(boardId: string, threadId: number, member?: MemberReqPayload) {
    // FIXME: replace to threadViewRepository after implementing comment, like feature
    const thread = await this.threadsRepository.findOne({where: {id: threadId, boardId}});
    if (!thread) throw new TextersHttpException("THREAD_NOT_FOUND");
    if (thread.isHidden && !this.canViewHiddenThread(thread.authorId, member))
      throw new TextersHttpException("NOT_AUTHORIZED_TO_VIEW_HIDDEN_THREAD");

    return thread;
  }

  async updateThread(
    boardId: string,
    threadId: number,
    updateThreadDto: UpdateThreadDto,
    member?: MemberReqPayload,
  ) {
    const thread = await this.threadsRepository.findOne({where: {id: threadId, boardId}});
    if (!thread) throw new TextersHttpException("THREAD_NOT_FOUND");

    return member
      ? this.updateAuthenticatedThread(thread, updateThreadDto, member)
      : this.updateUnauthenticatedThread(thread, updateThreadDto);
  }

  private async createAuthenticatedThread(
    boardId: string,
    createThreadDto: CreateThreadDto,
    member: MemberReqPayload,
  ) {
    const {id} = await this.threadsRepository.save(
      Thread.fromAuthenticated(boardId, createThreadDto, member),
    );
    return await this.threadsRepository.findOne({where: {id}});
  }

  private async createUnauthenticatedThread(boardId: string, createThreadDto: CreateThreadDto) {
    if (createThreadDto.isHidden)
      throw new TextersHttpException("NO_UNAUTHENTICATED_HIDDEN_THREAD_CREATION");

    const {id} = await this.threadsRepository.save(
      Thread.fromUnauthenticated(boardId, createThreadDto),
    );
    return await this.threadsRepository.findOne({where: {id}});
  }

  private canViewHiddenThread(authorId?: number, member?: MemberReqPayload) {
    if (member?.role === "ROLE_ADMIN") return true;
    if (!member) return false;
    return authorId === member?.id;
  }

  private async updateAuthenticatedThread(
    thread: Thread,
    updateThreadDto: UpdateThreadDto,
    member: MemberReqPayload,
  ) {
    if (thread.authorId && thread.authorId !== member.id)
      throw new TextersHttpException("NOT_AUTHOR_OF_THREAD");

    const isAdmin = member?.role === "ROLE_ADMIN";
    const willUpdateFixedState =
      updateThreadDto.isFixed && updateThreadDto.isFixed !== thread.isFixed;
    if (!isAdmin && willUpdateFixedState) throw new TextersHttpException("NOT_AUTHORIZED_MEMBER");

    Object.assign(thread, R.omit(["password"], updateThreadDto));
    await this.threadsRepository.save(thread);
    return thread;
  }

  private async updateUnauthenticatedThread(thread: Thread, updateThreadDto: UpdateThreadDto) {
    if (!updateThreadDto.password || !thread.validatePassword(updateThreadDto.password))
      throw new TextersHttpException("NOT_AUTHOR_OF_THREAD");
    if (updateThreadDto.isFixed) throw new TextersHttpException("NOT_AUTHORIZED_MEMBER");

    Object.assign(thread, updateThreadDto);
    await this.threadsRepository.save(thread);
    return thread;
  }
}
