import {BoardsService} from "@/features/boards/boards.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Member} from "@/features/members/model/member.entity";
import {CreateThreadDto} from "@/features/threads/model/create-thread.dto";
import {
  ThreadOrderBy,
  ThreadSearchParams,
  ThreadType,
} from "@/features/threads/model/thread-search.params";
import {Thread} from "@/features/threads/model/thread.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ThreadsService {
  constructor(
    private readonly boardsService: BoardsService,
    @InjectRepository(Thread) private readonly threadsRepository: Repository<Thread>,
  ) {}

  async createThread(
    boardId: string,
    createThreadDto: CreateThreadDto,
    member?: Pick<Member, "id" | "role" | "penName">,
  ) {
    if (!(await this.boardsService.existsById(boardId)))
      throw new TextersHttpException("BOARD_NOT_FOUND");
    if (createThreadDto.isFixed && member?.role !== "ROLE_ADMIN")
      throw new TextersHttpException("NOT_AUTHORIZED_MEMBER");

    return member !== undefined
      ? await this.createAuthenticatedThread(createThreadDto, member)
      : await this.createUnauthenticatedThread(createThreadDto);
  }

  async authorizePassword(id: number, password: string) {
    const thread = await this.threadsRepository.findOne({where: {id}});
    if (!thread) throw new TextersHttpException("THREAD_NOT_FOUND");
    if (thread.password !== Thread.hashPassword(password))
      throw new TextersHttpException("WRONG_THREAD_PASSWORD");
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
      where: {...(shouldFilterFixed && {isFixed: true})},
      relations: {author: true},
      take: limit,
      skip: (page - 1) * limit,
      order: {[orderBy]: "DESC"},
    });

    return {threads, totalCount};
  }

  async findThreadById(id: number, member?: Pick<Member, "id" | "role" | "penName">) {
    // FIXME: replace to threadViewRepository after implementing comment, like feature
    const thread = await this.threadsRepository.findOne({where: {id}});
    if (thread.isHidden && !this.canViewHiddenThread(thread.authorId, member))
      throw new TextersHttpException("NOT_AUTHORIZED_TO_VIEW_HIDDEN_THREAD");

    return thread;
  }

  private async createAuthenticatedThread(
    createThreadDto: CreateThreadDto,
    member: Pick<Member, "id" | "role" | "penName">,
  ) {
    const {id} = await this.threadsRepository.save(
      Thread.fromAuthenticated(createThreadDto, member),
    );
    return await this.threadsRepository.findOne({where: {id}});
  }

  private async createUnauthenticatedThread(createThreadDto: CreateThreadDto) {
    if (createThreadDto.isHidden)
      throw new TextersHttpException("NO_UNAUTHENTICATED_HIDDEN_THREAD_CREATION");

    const {id} = await this.threadsRepository.save(Thread.fromUnauthenticated(createThreadDto));
    return await this.threadsRepository.findOne({where: {id}});
  }

  private canViewHiddenThread(authorId?: number, member?: Pick<Member, "id" | "role" | "penName">) {
    if (member?.role === "ROLE_ADMIN") return true;
    if (!member) return false;
    return authorId === member?.id;
  }
}
