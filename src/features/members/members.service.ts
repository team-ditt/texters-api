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

  findOne(id: number): Promise<Member | null> {
    return this.membersRepository.findOneBy({id});

  public isExist(where: FindOptionsWhere<Member>) {
    return this.membersRepository.exist({where});
  }
}
