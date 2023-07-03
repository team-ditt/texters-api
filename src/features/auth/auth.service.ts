import {Member, MembersService} from "@/features/members";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Auth} from "./model/auth.entity";
import {OauthProvider} from "./model/oauth-provider.enum";

@Injectable()
export class AuthService {
  constructor(
    private membersService: MembersService,
    private jwtService: JwtService,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  public async signIn(provider: OauthProvider, authorizationCode: string) {
    const email = await this.signInWithOauth(provider, authorizationCode);
    const member = await this.membersService.findOne({email});
    return member
      ? {responseType: "signIn", tokens: this.issueAuthTokens(member)}
      : {responseType: "signUp", token: this.issueRegisterToken(email)};
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
    // 카카오 SDK 통신 후 액세스토큰 발급
    // return 추출한 email
    // FIXME: 더미데이터 이메일 대신 실제 SDK 연결
    return "example@google.com";
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

  private issueRegisterToken(email: string) {
    return this.jwtService.sign({data: {email}});
  }

  public async signUp(registerToken: string, email: string, penName: string) {
    try {
      this.jwtService.verify(registerToken);
    } catch {
      throw new UnauthorizedException("Invalid Register Token.");
    }
    const member = await this.membersService.create(email, penName);
    return this.issueAuthTokens(member);
  }
}
