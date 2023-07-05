import {AuthGuard, RefreshGuard} from "@/features/common";
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
import {AuthService} from "./auth.service";
import {SignInDto} from "./model/sign-in.dto";
import {SignUpDto} from "./model/sign-up.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  public async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const {accessToken, refreshToken} = await this.authService.signInOrThrow(
      signInDto.provider,
      signInDto.authorizationCode,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    res.send(accessToken);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("sign-up")
  public async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const {accessToken, refreshToken} = await this.authService.signUp(
      signUpDto.oauthId,
      signUpDto.penName,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    res.send(accessToken);
  }

  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Get("token-refresh")
  public async refreshAuthTokens(@Req() req: Request, @Res() res: Response) {
    const {accessToken, refreshToken} = await this.authService.reissueAuthTokens(
      req["member"].id,
      req.cookies.RefreshToken,
    );
    this.setAuthCookies(res, accessToken, refreshToken);
    res.send(accessToken);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("sign-out")
  public async signOut(@Req() req: Request, @Res() res: Response) {
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
