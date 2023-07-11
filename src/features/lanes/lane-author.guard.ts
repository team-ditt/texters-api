import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {LanesService} from "@/features/lanes/lanes.service";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class LaneAuthorGuard implements CanActivate {
  constructor(private readonly lanesService: LanesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const laneId = parseInt(request.params.laneId);
    const memberId = request.member.id;

    const isAuthor = await this.lanesService.isAuthor(memberId, laneId);
    if (!isAuthor) throw new TextersHttpException("NOT_AUTHOR");
    return true;
  }
}
