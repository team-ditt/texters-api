import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {ThreadLikedController} from "./thread-liked.controller";

@Module({
  imports: [SharedModule],
  controllers: [ThreadLikedController],
})
export class ThreadLikedModule {}
