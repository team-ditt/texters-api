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

  findById(id: number) {
    return this.memberRepository.findOne({where: {id}});
  }

  findByOauthId(oauthId: string) {
    return this.memberRepository.findOne({where: {oauthId}});
  }

  create(email: string, penName: string) {
    return this.memberRepository.save(Member.of(email, penName));
  }

  isExist(where: FindOptionsWhere<Member>) {
    return this.memberRepository.exist({where});
  }
}
