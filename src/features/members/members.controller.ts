import {Controller, Get} from "@nestjs/common";
import {MembersService} from "./members.service";

@Controller("members")
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get("me")
  async findLoginUser() {
    return await this.membersService.findOne(1);
  }
}
