import {AuthService} from "@/features/auth/auth.service";
import {SignInDto} from "@/features/auth/model/sign-in.dto";
import {SignUpDto} from "@/features/auth/model/sign-up.dto";
import {AuthGuard} from "@/features/shared/auth.guard";
import {RefreshGuard} from "@/features/shared/refresh.guard";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {Request, Response} from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const {accessToken, refreshToken} = await this.authService.signInOrThrow(
      signInDto.provider,
      signInDto.authorizationCode,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    res.send(accessToken);
  }

  @Post("sign-up")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const {accessToken, refreshToken} = await this.authService.signUp(
      signUpDto.oauthId,
      signUpDto.penName,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    res.send(accessToken);
  }

  @Get("token-refresh")
  @UseGuards(RefreshGuard)
  async refreshAuthTokens(@Req() req: Request, @Res() res: Response) {
    const {accessToken, refreshToken} = await this.authService.reissueAuthTokens(
      req["member"].id,
      req.cookies.RefreshToken,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    res.send(accessToken);
  }

  @Post("sign-out")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Req() req: Request, @Res() res: Response) {
    await this.authService.signOut(req["member"].id);
    res.clearCookie("Authorization");
    res.clearCookie("RefreshToken");
    res.send();
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const expiresInDays = 1;
    const cookieOptions = {
      maxAge: expiresInDays * 24 * 60 * 60 * 1000,
      sameSite: "strict" as const,
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
    };

    res.cookie("Authorization", `Bearer ${accessToken}`, cookieOptions);
    res.cookie("RefreshToken", refreshToken, cookieOptions);
  }
}
