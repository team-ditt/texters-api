import {IsEmail, IsJWT, IsNotEmpty, IsString, Matches, MaxLength} from "class-validator";

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @MaxLength(15)
  @Matches("[a-zA-Z0-9가-힝]{1,15}")
  @IsNotEmpty()
  public penName: string;

  @IsJWT()
  @IsNotEmpty()
  public registerToken: string;
}
