import {IsNotEmpty, IsString, Matches, MaxLength} from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  public oauthId: string;

  @IsString()
  @MaxLength(15)
  @Matches("[a-zA-Z0-9가-힝]{1,15}")
  @IsNotEmpty()
  public penName: string;
}
