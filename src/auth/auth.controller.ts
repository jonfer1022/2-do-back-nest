import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthConfirmSignUpDto,
  AuthSignUpDto,
  AuthSignInDto,
} from './dto/auth.dto';
import { RequestAuth } from 'src/common/types/request.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() authDto: AuthSignUpDto) {
    return await this.authService.signUp(authDto);
  }

  @Post('/confirm-signup')
  @HttpCode(HttpStatus.OK)
  async confirmSignUp(@Body() authDto: AuthConfirmSignUpDto) {
    return await this.authService.confirmSignUp(authDto, authDto.code);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authDto: AuthSignInDto) {
    return await this.authService.signIn(authDto);
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req: RequestAuth) {
    return await this.authService.signOut(req.user.token);
  }
}
