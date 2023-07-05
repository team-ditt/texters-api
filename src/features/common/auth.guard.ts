import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";
import {Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractAccessTokenFromCookie(request);
    if (!accessToken) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(accessToken);
      request["member"] = payload.member;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractAccessTokenFromCookie(request: Request): string | undefined {
    const [type, accessToken] = request.cookies.Authorization?.split(" ") ?? [];
    return type === "Bearer" ? accessToken : undefined;
  }
}
