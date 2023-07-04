import {AuthGuard} from "@/features/common";
import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from "@nestjs/common";
import {MembersService} from "./members.service";

@Controller("members")
export class MembersController {
  constructor(private membersService: MembersService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get("pen-name/:penName/unique")
  public async isUniquePenName(@Param("penName") penName: string) {
    const isExist = await this.membersService.isExist({penName});
    if (isExist) throw new HttpException("Pen name already exists.", HttpStatus.CONFLICT);
    return;
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  public getProfile(@Request() req) {
    return this.membersService.findOne({id: req.user.id});
  }
}
