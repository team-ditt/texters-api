import {AuthGuard} from "@/features/common";
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
import {MembersService} from "./members.service";

@Controller("members")
export class MembersController {
  constructor(private membersService: MembersService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get("pen-name/:penName/unique")
  public async isUniquePenName(@Param("penName") penName: string) {
    const isExist = await this.membersService.isExist({penName});
    if (isExist) throw new ConflictException("Pen name already exists.");
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get("profile")
  public getProfile(@Request() req: Response) {
    return this.membersService.findOne({id: req["member"].id});
  }
}
