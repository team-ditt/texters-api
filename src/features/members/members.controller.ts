import {MembersService} from "@/features/members/members.service";
import {AuthGuard} from "@/features/shared/auth.guard";
import {
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from "@nestjs/common";
import {Response} from "express";

@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get("pen-name/:penName/unique")
  @HttpCode(HttpStatus.NO_CONTENT)
  async isUniquePenName(@Param("penName") penName: string) {
    const isExist = await this.membersService.isExist({penName});
    if (isExist) throw new ConflictException("Pen name already exists.");
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: Response) {
    return this.membersService.findById(req["member"].id);
  }
}
