import {CommentMapper} from "@/features/comments/comment.mapper";
import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {CommentsController} from "./comments.controller";

@Module({
  imports: [SharedModule],
  controllers: [CommentsController],
  providers: [CommentMapper],
})
export class CommentsModule {}
