import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Request as RequestType } from 'express';


type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([AccessTokenStrategy.extractCookies, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      secretOrKey: configService.secrets.accessSecret,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }

  private static extractCookies(req: RequestType): string | null {
    console.log('Inside cookie extractor')
    if (req.cookies && 'access-token' in req.cookies) {
      return req.cookies['access-token'];
    }
    return null;
  }
}

