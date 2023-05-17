import { Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
