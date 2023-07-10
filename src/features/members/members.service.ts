import {Member} from "@/features/members/model/member.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsWhere, Repository} from "typeorm";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  findById(id: number) {
    return this.membersRepository.findOne({where: {id}});
  }

  findByOauthId(oauthId: string) {
    return this.membersRepository.findOne({where: {oauthId}});
  }

  create(email: string, penName: string) {
    return this.membersRepository.save(Member.of(email, penName));
  }

  isExist(where: FindOptionsWhere<Member>) {
    return this.membersRepository.exist({where});
  }
}
