import { Body, Req, Controller, HttpCode, Post, UseGuards, Get, SerializeOptions } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto';
import { RequestWithUser } from '../interfaces';
import { LocalAuthenticationGuard } from './localAuthentication.quard';
import { JwtAuthenticationGuard } from './jwtAuthentication.guard';

@Controller('authentication')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authenticationService.register(registrationData);
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);

    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() request: RequestWithUser) {
    const cookie = this.authenticationService.getCookieForLogOut();
    request.res.setHeader('Set-cookie', cookie);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
