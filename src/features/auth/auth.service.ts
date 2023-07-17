import {Auth} from "@/features/auth/model/auth.entity";
import {OauthProvider} from "@/features/auth/model/oauth-provider.enum";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {MembersService} from "@/features/members/members.service";
import {Member} from "@/features/members/model/member.entity";
import {HttpService} from "@nestjs/axios";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {createHash} from "crypto";
import {google} from "googleapis";
import {lastValueFrom, map} from "rxjs";
import {Repository} from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) {}

  async signInOrThrow(provider: OauthProvider, authorizationCode: string) {
    const oauthId = await this.signInWithOauth(provider, authorizationCode);
    const member = await this.membersService.findByOauthId(oauthId);
    if (!member) throw new TextersHttpException("NOT_REGISTERED", {oauthId});
    return this.issueAuthTokens(member);
  }

  async signUp(oauthId: string, penName: string) {
    if (await this.membersService.isExist({oauthId}))
      throw new TextersHttpException("ALREADY_REGISTERED");

    const member = await this.membersService.create(oauthId, penName);
    return this.issueAuthTokens(member);
  }

  async reissueAuthTokens(memberId: number, refreshToken: string) {
    const auth = await this.authRepository.findOne({where: {id: memberId}});

    if (auth.refreshToken !== refreshToken) throw new TextersHttpException("INVALID_AUTH_TOKEN");
    const member = await this.membersService.findById(memberId);
    return this.issueAuthTokens(member);
  }

  async signOut(memberId: number) {
    await this.authRepository.delete({id: memberId});
  }

  private async signInWithOauth(provider: OauthProvider, authorizationCode: string) {
    switch (provider) {
      case OauthProvider.KAKAO:
        return this.signInWithKakao(authorizationCode);
      case OauthProvider.NAVER:
        return this.signInWithNaver(authorizationCode);
      case OauthProvider.GOOGLE:
        return this.signInWithGoogle(authorizationCode);
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
            redirect_uri: this.configService.get<string>("CLIENT_URL") + "/sign-in?oauth=kakao",
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

    return this.hashOauthId(`KAKAO-${id}`);
  }

  private async signInWithNaver(authorizationCode: string): Promise<string> {
    const clientId = this.configService.get<string>("OAUTH_NAVER_CLIENT_ID");
    const clientSecret = this.configService.get<string>("OAUTH_NAVER_CLIENT_SECRET");

    // 1. 인증코드로 액세스토큰 발급
    const {access_token: accessToken} = await lastValueFrom(
      this.httpService
        .get("https://nid.naver.com/oauth2.0/token", {
          params: {
            grant_type: "authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: this.configService.get<string>("CLIENT_URL") + "/sign-in?oauth=naver",
            code: authorizationCode,
          },
          headers: {
            "X_Naver-Client-Id": clientId,
            "X-Naver-Client-Secret": clientSecret,
          },
        })
        .pipe(map(res => res.data)),
    );
    // 2. 발급된 액세스토큰으로 회원번호 조회
    const {response} = await lastValueFrom(
      this.httpService
        .get("https://openapi.naver.com/v1/nid/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(map(res => res.data)),
    );

    return this.hashOauthId(`NAVER-${response.id}`);
  }

  private async signInWithGoogle(authorizationCode: string): Promise<string> {
    const clientId = this.configService.get<string>("OAUTH_GOOGLE_CLIENT_ID");
    const clientSecret = this.configService.get<string>("OAUTH_GOOGLE_CLIENT_SECRET");
    const redirectUri = this.configService.get<string>("CLIENT_URL") + "/sign-in?oauth=google";
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    // 1. 인증코드로 ID 토큰 발급
    const {tokens} = await oauth2Client.getToken(authorizationCode);

    // 2. ID 토큰에서 이메일 추출
    const payload = this.jwtService.decode(tokens.id_token);

    return this.hashOauthId(`GOOGLE-${payload["email"]}`);
  }

  private hashOauthId(oauthId: string): string {
    return createHash("sha256").update(oauthId).digest("hex");
  }

  private issueAuthTokens(member: Member) {
    const payload = {id: member.id, role: member.role, penName: member.penName};
    const accessToken = this.jwtService.sign({member: payload});
    const refreshToken = this.jwtService.sign({member: payload}, {expiresIn: "1d"});
    this.saveRefreshToken(member.id, refreshToken);
    return {accessToken, refreshToken};
  }

  private saveRefreshToken(id: number, refreshToken: string) {
    this.authRepository.save(Auth.of(id, refreshToken));
  }
}
