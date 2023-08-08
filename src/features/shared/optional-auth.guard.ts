import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractAccessTokenFromHeader(request);
    if (!accessToken) return true;

    try {
      const payload = this.jwtService.verify(accessToken);
      request["member"] = payload.member;
    } catch {
      throw new TextersHttpException("INVALID_AUTH_TOKEN");
    }
    return true;
  }

  private extractAccessTokenFromHeader(request: Request): string | undefined {
    const [type, accessToken] =
      (request.headers.authorization as string | undefined)?.split(" ") ?? [];
    return type === "Bearer" ? accessToken : undefined;
  }
}
