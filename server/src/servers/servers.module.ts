import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LoggerModule,
    AuthModule,
    ConfigModule
  ],
  providers: [ServersService],
  controllers: [],
  exports: [ServersService]
})
export class ServersModule {}
