import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../common/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { ServersModule } from '../servers/servers.module';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LoggerModule,
    AuthModule,
    ConfigModule,
    ServersModule,
    UtilModule,
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
})
export class SettingsModule {}
