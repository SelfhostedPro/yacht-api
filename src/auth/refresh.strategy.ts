import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStrategy.extractCookies]),
      secretOrKey: configService.secrets.refreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: RequestType, payload: any) {
    let refreshToken = req.cookies['refresh-token']
    return { ...payload, refreshToken };
  }

  private static extractCookies(req: RequestType): string | null {
    if (req.cookies && 'refresh-token' in req.cookies) {
      return req.cookies['refresh-token'];
    }
    return null;
  }
}