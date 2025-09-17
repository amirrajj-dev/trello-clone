import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { AuthReturnType } from './types/auth-return.interface';
import { LoginDto } from './dtos/login.dto';
import { RestrcitEmailDomainPipe } from 'src/common/pipes/restrict-email.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body(RestrcitEmailDomainPipe) signUpUserDto: SignUpDto,
  ): Promise<AuthReturnType | null> {
    return this.authService.signup(signUpUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body(RestrcitEmailDomainPipe) loginUserDto: LoginDto,
  ): Promise<AuthReturnType | null> {
    return this.authService.login(loginUserDto);
  }
}
