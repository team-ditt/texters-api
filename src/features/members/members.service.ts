import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Member} from "@/features/members/model/member.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsWhere, Repository} from "typeorm";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async findById(id: number) {
    const member = await this.memberRepository.findOne({where: {id}});
    if (!member) throw new TextersHttpException("MEMBER_NOT_FOUND");
    return member;
  }

  async findByOauthId(oauthId: string) {
    const member = await this.memberRepository.findOne({where: {oauthId}});
    if (!member) throw new TextersHttpException("MEMBER_NOT_FOUND");
    return member;
  }

  create(email: string, penName: string) {
    return this.memberRepository.save(Member.of(email, penName));
  }

  isExist(where: FindOptionsWhere<Member>) {
    return this.memberRepository.exist({where});
  }

  async deleteById(id: number) {
    const member = await this.memberRepository.findOne({where: {id}, relations: {books: true}});
    if (!member) throw new TextersHttpException("MEMBER_NOT_FOUND");
    if (member.books.length) throw new TextersHttpException("CANNOT_WITHDRAW_NOT_EMPTY_DASHBOARD");

    await this.memberRepository.remove(member);
  }
}
