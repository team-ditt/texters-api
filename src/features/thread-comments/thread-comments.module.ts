import {SharedModule} from "@/features/shared/shared.module";
import {ThreadCommentMapper} from "@/features/thread-comments/thread-comment.mapper";
import {Module} from "@nestjs/common";
import {ThreadCommentsController} from "./thread-comments.controller";

@Module({
  imports: [SharedModule],
  controllers: [ThreadCommentsController],
  providers: [ThreadCommentMapper],
})
export class ThreadCommentsModule {}
