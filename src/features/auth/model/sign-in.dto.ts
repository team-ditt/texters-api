import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {OauthProvider} from "./oauth-provider.enum";

export class SignInDto {
  @IsEnum(OauthProvider)
  @IsNotEmpty()
  public provider: OauthProvider;

  @IsString()
  @IsNotEmpty()
  public authorizationCode: string;
}
