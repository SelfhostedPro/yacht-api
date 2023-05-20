import { Global, Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Global()
@Module({
  imports: [NotificationsModule],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
