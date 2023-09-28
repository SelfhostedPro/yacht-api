import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { UserDto } from '../../users/users.dto';
import { AccessTokenGuard } from './accessToken.guard';

@Injectable()
export class WsAccessTokenGuard extends AccessTokenGuard { }
