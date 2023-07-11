import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {PagesService} from "@/features/pages/pages.service";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class PageAuthorGuard implements CanActivate {
  constructor(private readonly pagesService: PagesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pageId = parseInt(request.params.pageId);
    const memberId = request.member.id;

    const isAuthor = await this.pagesService.isAuthor(memberId, pageId);
    if (!isAuthor) throw new TextersHttpException("NOT_AUTHOR");
    return true;
  }
}
