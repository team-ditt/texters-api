import {BookLikedService} from "@/features/book-liked/book-liked.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {AuthGuard} from "@/features/shared/auth.guard";
import {Controller, Get, Param, Put, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";

@Controller()
export class BookLikedController {
  constructor(private readonly bookLikedService: BookLikedService) {}

  @Put("members/:memberId/books/:bookId/liked")
  @UseGuards(AuthGuard)
  async toggleBookLiked(
    @Req() req: Request,
    @Param("memberId") memberId: number,
    @Param("bookId") bookId: number,
  ) {
    if (req["member"].id !== memberId) throw new TextersHttpException("NOT_AUTHORIZED_MEMBER");
    const liked = await this.bookLikedService.toggleBookLiked(memberId, bookId);
    return {liked};
  }

  @Get("members/:memberId/books/:bookId/liked")
  @UseGuards(AuthGuard)
  async checkBookLiked(
    @Req() req: Request,
    @Param("memberId") memberId: number,
    @Param("bookId") bookId: number,
  ) {
    if (req["member"].id !== memberId) throw new TextersHttpException("NOT_AUTHORIZED_MEMBER");
    const liked = await this.bookLikedService.isLiked(memberId, bookId);
    return {liked};
  }
}
