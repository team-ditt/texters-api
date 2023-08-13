import {SharedModule} from "@/features/shared/shared.module";
import {ThreadMapper} from "@/features/threads/thread.mapper";
import {Module} from "@nestjs/common";
import {ThreadsController} from "./threads.controller";

@Module({
  imports: [SharedModule],
  controllers: [ThreadsController],
  providers: [ThreadMapper],
})
export class ThreadsModule {}
