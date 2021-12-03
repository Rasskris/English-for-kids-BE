import { Body, Req, Controller, HttpCode, Post, UseGuards, Get, SerializeOptions, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto';
import { RequestWithUser } from '../interfaces';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { JwtAuthenticationGuard } from './jwtAuthentication.guard';

@Controller('authentication')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async signUp(@Body() registrationData: RegisterDto, @Res() res: Response) {
    await this.authenticationService.register(registrationData);

    return res.send({ success: true });
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('signin')
  @HttpCode(200)
  async signIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);

    request.res.setHeader('Set-Cookie', cookie);

    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('signout')
  @HttpCode(200)
  async signOut(@Req() request: RequestWithUser, @Res() res: Response) {
    const cookie = this.authenticationService.getCookieForLogOut();

    request.res.setHeader('Set-cookie', cookie);

    return res.send({ success: true });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
