import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {BoardsController} from "./boards.controller";

@Module({
  imports: [SharedModule],
  controllers: [BoardsController],
})
export class BoardsModule {}
