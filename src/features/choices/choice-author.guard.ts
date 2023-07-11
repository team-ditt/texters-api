import {ChoicesService} from "@/features/choices/choices.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class ChoiceAuthorGuard implements CanActivate {
  constructor(private readonly choicesService: ChoicesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const choiceId = parseInt(request.params.choiceId);
    const memberId = request.member.id;

    const isAuthor = await this.choicesService.isAuthor(memberId, choiceId);
    if (!isAuthor) throw new TextersHttpException("NOT_AUTHOR");
    return true;
  }
}
