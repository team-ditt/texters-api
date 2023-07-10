import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractAccessTokenFromHeader(request);
    if (!accessToken) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(accessToken);
      request["member"] = payload.member;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractAccessTokenFromHeader(request: Request): string | undefined {
    const [type, accessToken] =
      (request.headers.authorization as string | undefined)?.split(" ") ?? [];
    return type === "Bearer" ? accessToken : undefined;
  }
}
