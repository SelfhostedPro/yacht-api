import { Module } from '@nestjs/common';

import { SetupWizardController } from './setup-wizard.controller';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, LoggerModule, AuthModule],
  controllers: [SetupWizardController],
})
export class SetupWizardModule {}
