import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from '../logger/logger.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, LoggerModule, AuthModule, HttpModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
