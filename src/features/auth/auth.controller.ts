import {SignInDto} from "@/features/auth/model/sign-in.dto";
import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {SignUpDto} from "./model/sign-up.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.provider, signInDto.authorizationCode);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("sign-up")
  public signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.registerToken, signUpDto.email, signUpDto.penName);
  }
}
