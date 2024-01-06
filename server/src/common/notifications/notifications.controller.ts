import {
  Controller,
  HttpException,
  Sse,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { NotificationsService } from './notifications.service';
import { Observable, fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvent } from '@yacht/types';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Sse()
  async streamNotifications(): Promise<Observable<any>> {
    try {
      return fromEvent(this.eventEmitter, 'message');
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
}
