import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class DashBoardGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginUserId = request.member.id;
    const memberId = parseInt(request.params.memberId);

    const canSearch = loginUserId === memberId;
    if (!canSearch) throw new TextersHttpException("NOT_AUTHORIZED_MEMBER");

    return canSearch;
  }
}
