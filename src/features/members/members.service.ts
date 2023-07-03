import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsWhere, Repository} from "typeorm";
import {Member} from "./model/member.entity";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  public findOne(where: FindOptionsWhere<Member>) {
    return this.membersRepository.findOne({where});
  }

  public create(email: string, penName: string) {
    return this.membersRepository.save(Member.of(email, penName));
  }

  public isExist(where: FindOptionsWhere<Member>) {
    return this.membersRepository.exist({where});
  }
}
