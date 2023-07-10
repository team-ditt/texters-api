import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.RefreshToken;
    if (!refreshToken) throw new TextersHttpException("INVALID_AUTH_TOKEN");

    try {
      const payload = this.jwtService.verify(refreshToken);
      request["member"] = payload.member;
    } catch {
      throw new TextersHttpException("INVALID_AUTH_TOKEN");
    }
    return true;
  }
}
