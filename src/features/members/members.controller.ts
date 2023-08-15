import {AuthGuard} from "@/features/auth/auth.guard";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {MembersService} from "@/features/members/members.service";
import {
  Controller,
  Delete,
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
    if (isExist) throw new TextersHttpException("DUPLICATE_PEN_NAME");
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: Response) {
    return this.membersService.findById(req["member"].id);
  }

  @Delete(":memberId")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async withdrawById(@Param("memberId") memberId: number) {
    return this.membersService.deleteById(memberId);
  }
}
