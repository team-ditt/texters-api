import {Board} from "@/features/boards/model/board.entity";
import {CreateBoardDto} from "@/features/boards/model/create-board.dto";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class BoardsService {
  constructor(@InjectRepository(Board) private readonly boardsRepository: Repository<Board>) {}

  async createBoard(createBoardDto: CreateBoardDto) {
    const {id, name} = createBoardDto;
    if (await this.existById(id)) throw new TextersHttpException("DUPLICATE_BOARD_ID");
    return await this.boardsRepository.save(Board.of(id, name));
  }

  async existById(id: string) {
    return await this.boardsRepository.exist({where: {id}});
  }
}
