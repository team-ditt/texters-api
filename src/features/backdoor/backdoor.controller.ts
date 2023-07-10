import {BackdoorService} from "@/features/backdoor/backdoor.service";
import {Controller, Get, Param} from "@nestjs/common";

@Controller("backdoor")
export class BackdoorController {
  constructor(private readonly backdoorService: BackdoorService) {}

  @Get("user")
  getUserAccessToken() {
    return this.backdoorService.issueAccessToken("ROLE_USER");
  }

  @Get("admin")
  getAdminAccessToken() {
    return this.backdoorService.issueAccessToken("ROLE_ADMIN");
  }

  @Get(":memberId")
  async getMemberAccessToken(@Param("memberId") memberId: number) {
    return await this.backdoorService.issueMemberAccessToken(memberId);
  }
}
