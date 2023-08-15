import {AuthGuard} from "@/features/auth/auth.guard";
import {BoardsService} from "@/features/boards/boards.service";
import {CreateBoardDto} from "@/features/boards/model/create-board.dto";
import {Roles} from "@/features/roles/roles.decorator";
import {RolesGuard} from "@/features/roles/roles.guard";
import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from "@nestjs/common";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @Roles("admin")
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.createBoard(createBoardDto);
  }
}
