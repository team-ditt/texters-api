import {Member, MembersService} from "@/features/members";
import {HttpService} from "@nestjs/axios";
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {lastValueFrom, map} from "rxjs";
import {Repository} from "typeorm";
import {Auth} from "./model/auth.entity";
import {OauthProvider} from "./model/oauth-provider.enum";

@Injectable()
export class AuthService {
  constructor(
    private membersService: MembersService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  public async signIn(provider: OauthProvider, authorizationCode: string) {
    const oauthId = await this.signInWithOauth(provider, authorizationCode);
    const member = await this.membersService.findOne({oauthId});
    return member
      ? {responseType: "signIn", tokens: this.issueAuthTokens(member)}
      : {responseType: "signUp", oauthId};
  }

  private async signInWithOauth(provider: OauthProvider, authorizationCode: string) {
    switch (provider) {
      case OauthProvider.KAKAO:
        return this.signInWithKakao(authorizationCode);
      case OauthProvider.NAVER:
        return this.signInWithNaver(authorizationCode);
      case OauthProvider.GOOGLE:
        return this.signInWithNaver(authorizationCode);
    }
  }

  private async signInWithKakao(authorizationCode: string): Promise<string> {
    // 1. 인증코드로 액세스토큰 발급
    const {access_token: accessToken} = await lastValueFrom(
      this.httpService
        .post(
          "https://kauth.kakao.com/oauth/token",
          {
            grant_type: "authorization_code",
            client_id: this.configService.get<string>("OAUTH_KAKAO_CLIENT_ID"),
            redirect_uri: this.configService.get<string>("CLIENT_URL") + "/login/oauth/kakao",
            code: authorizationCode,
          },
          {headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}},
        )
        .pipe(map(res => res.data)),
    );
    // 2. 발급된 액세스토큰으로 회원번호 조회
    const {id} = await lastValueFrom(
      this.httpService
        .get("https://kapi.kakao.com/v1/user/access_token_info", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(map(res => res.data)),
    );

    return `KAKAO-${id}`;
  }

  private async signInWithNaver(authorizationCode: string): Promise<string> {
    // 네이버 SDK 통신 후 액세스토큰 발급
    // return 추출한 email
    // FIXME: 더미데이터 이메일 대신 실제 SDK 연결
    return "example@google.com";
  }

  private async signInWithGoogle(authorizationCode: string): Promise<string> {
    // 구글 SDK 통신 후 액세스토큰 발급
    // return 추출한 email
    // FIXME: 더미데이터 이메일 대신 실제 SDK 연결
    return "example@google.com";
  }

  private issueAuthTokens(member: Member) {
    const accessToken = this.jwtService.sign({
      member: {id: member.id, role: member.role, penName: member.penName},
    });
    const refreshToken = this.jwtService.sign({}, {expiresIn: "1d"});
    this.saveRefreshToken(member.id, refreshToken);
    return {accessToken, refreshToken};
  }

  private saveRefreshToken(id: number, refreshToken: string) {
    this.authRepository.save(Auth.of(id, refreshToken));
  }

  public async signUp(oauthId: string, penName: string) {
    if (await this.membersService.isExist({oauthId}))
      throw new HttpException("Member already exists.", HttpStatus.CONFLICT);

    const member = await this.membersService.create(oauthId, penName);
    return {responseType: "signIn", tokens: this.issueAuthTokens(member)};
  }
}
