import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { LoggerModule } from '../logger/logger.module';
import { PassportModule } from '@nestjs/passport';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
