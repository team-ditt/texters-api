import {BookCommentMapper} from "@/features/book-comments/book-comment.mapper";
import {BookCommentsController} from "@/features/book-comments/book-comments.controller";
import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";

@Module({
  imports: [SharedModule],
  controllers: [BookCommentsController],
  providers: [BookCommentMapper],
})
export class BookCommentsModule {}
