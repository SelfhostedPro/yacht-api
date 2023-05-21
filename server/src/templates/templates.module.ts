import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule, AuthModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
