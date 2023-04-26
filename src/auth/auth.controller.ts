import { Controller, Post, Body, Get, UseGuards, Header, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, TokensDto } from './auth.dto';
import { ConfigService } from '../config/config.service';
import { UserActivateOtpDto, UserDeactivateOtpDto, UserUpdatePasswordDto } from 'src/users/users.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { Request, Response } from 'express';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  @ApiOperation({
    summary: 'Exchange a username and password for an authentication token.',
  })
  @Post('login')
  async signIn(@Body() body: AuthDto, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.authService.signIn(body.username, body.password, body.otp);
    this.authService.storeTokensInCookies(response,tokens)
    response.send({ username: tokens.username})
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request, @Res() response: Response) {
    const id = req.user['sub'];
    const oldRefreshToken = req.user['refreshToken'];

    const tokens = await this.authService.refreshTokens(id, oldRefreshToken)
    this.authService.storeTokensInCookies(response,tokens)
    response.send({ result: 'ok' })
  }

  @Get('/settings')
  @ApiOperation({
    summary: 'Return settings required to load the UI before authentication.',
  })
  getSettings() {
    return this.configService.uiSettings();
  }

  @ApiOperation({
    summary:
      'This method can be used to obtain an access token ONLY when authentication has been disabled.',
  })
  @Post('/noauth')
  getToken() {
    return this.authService.generateNoAuthToken();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check to see if an authentication token is still valid.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/check')
  checkAuth() {
    return { status: 'OK' };
  }

  @ApiOperation({ summary: 'Update the password for the current user.' })
  @ApiBody({ type: UserUpdatePasswordDto })
  @Post('/change-password')
  updateOwnPassword(@Req() req, @Body() body: UserUpdatePasswordDto) {
    return this.authService.updateOwnPassword(
      req.user.username,
      body.currentPassword,
      body.newPassword,
    );
  }
  @ApiOperation({ summary: 'Start 2FA setup for the current user.' })
  @Post('/otp/setup')
  setupOtp(@Req() req) {
    return this.authService.setupOtp(req.user.username);
  }
  @ApiOperation({ summary: 'Activate 2FA setup for the current user.' })
  @ApiBody({ type: UserActivateOtpDto })
  @Post('/otp/activate')
  activateOtp(@Req() req, @Body() body: UserActivateOtpDto) {
    return this.authService.activateOtp(req.user.username, body.code);
  }
  @ApiOperation({ summary: 'Deactivate 2FA setup for the current user.' })
  @ApiBody({ type: UserDeactivateOtpDto })
  @Post('/otp/deactivate')
  deactivateOtp(@Req() req, @Body() body: UserDeactivateOtpDto) {
    return this.authService.deactivateOtp(req.user.username, body.password);
  }
}
