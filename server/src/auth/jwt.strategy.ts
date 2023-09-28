import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Request as RequestType } from 'express';
import { Socket } from 'socket.io'
var cookie = require('cookie');
import cookieParser from 'cookie-parser'

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractCookies,
      ]),
      secretOrKey: configService.secrets.accessSecret,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }

  private static extractCookies(req: any): string | null {
    if (req.cookies && 'access-token' in req.cookies) {
      return req.cookies['access-token'];
    } 
    else if (req.handshake && req.handshake.headers.cookie) {
      return cookie.parse(req.handshake.headers.cookie)['access-token']
    }
    return null;
  }
}
