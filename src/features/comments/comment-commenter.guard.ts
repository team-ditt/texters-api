import {CommentsService} from "@/features/comments/comments.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class CommentCommenterGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const commentId = parseInt(request.params.commentId);
    const memberId = request.member.id;

    const isCommenter = await this.commentsService.isCommenter(memberId, commentId);
    if (!isCommenter) throw new TextersHttpException("NOT_COMMENTER");
    return true;
  }
}
