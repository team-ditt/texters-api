import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {MemberRole} from "@/features/members/model/member.entity";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const member = request.member;
    const hasRole = this.hasRole(roles, member.role);
    if (!hasRole) throw new TextersHttpException("NOT_AUTHORIZED_MEMBER");
    return true;
  }

  private hasRole(roles: string[], rawRole: MemberRole) {
    const [_, role] = rawRole.split("_");
    return roles.includes(role.toLowerCase());
  }
}
