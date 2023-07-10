import {MembersService} from "@/features/members/members.service";
import {MemberRole} from "@/features/members/model/member.entity";
import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class BackdoorService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly membersService: MembersService,
  ) {}

  issueAccessToken(role: MemberRole) {
    return this.jwtService.sign({member: {id: 1, role, penName: "테스트 사용자"}});
  }

  async issueMemberAccessToken(memberId: number) {
    const member = await this.membersService.findById(memberId);
    const payload = {id: member.id, role: member.role, penName: member.penName};
    return this.jwtService.sign({member: payload});
  }
}
