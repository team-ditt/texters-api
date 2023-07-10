import {OauthProvider} from "@/features/auth/model/oauth-provider.enum";
import {IsEnum, IsNotEmpty, IsString} from "class-validator";

export class SignInDto {
  @IsNotEmpty()
  @IsEnum(OauthProvider)
  provider: OauthProvider;

  @IsNotEmpty()
  @IsString()
  authorizationCode: string;
}
