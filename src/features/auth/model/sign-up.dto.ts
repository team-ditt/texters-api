import {IsNotEmpty, IsString, Matches, MaxLength} from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  oauthId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9가-힝]{1,15}$/g)
  penName: string;
}
