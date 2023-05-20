import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from 'src/common/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from 'src/config/config.module';
import { ServersController } from './servers.controller';
import { UtilModule } from '../util/util.module';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LoggerModule,
    AuthModule,
    ConfigModule,
    UtilModule,
  ],
  providers: [ServersService],
  controllers: [ServersController],
  exports: [ServersService],
})
export class ServersModule {}
