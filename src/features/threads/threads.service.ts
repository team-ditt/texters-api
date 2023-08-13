import {BoardsService} from "@/features/boards/boards.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Member} from "@/features/members/model/member.entity";
import {CreateThreadDto} from "@/features/threads/model/create-thread.dto";
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

  async findThreadById(id: number) {
    return await this.threadsRepository.findOne({where: {id}, relations: {author: true}});
  }

  private async createAuthenticatedThread(
    createThreadDto: CreateThreadDto,
    member: Pick<Member, "id" | "role" | "penName">,
  ) {
    const {id} = await this.threadsRepository.save(
      Thread.fromAuthenticated(createThreadDto, member),
    );
    return await this.findThreadById(id);
  }

  private async createUnauthenticatedThread(createThreadDto: CreateThreadDto) {
    if (createThreadDto.isHidden)
      throw new TextersHttpException("NO_UNAUTHENTICATED_HIDDEN_THREAD");

    const {id} = await this.threadsRepository.save(Thread.fromUnauthenticated(createThreadDto));
    return await this.findThreadById(id);
  }
}
