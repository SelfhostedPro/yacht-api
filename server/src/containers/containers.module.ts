import { Module } from '@nestjs/common';
import { ContainersController } from './containers.controller';
import { ContainersService } from './containers.service';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../common/logger/logger.module';
import { ServersModule } from 'src/servers/servers.module';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LoggerModule,
    AuthModule,
    ServersModule,
    UtilModule,
  ],
  controllers: [ContainersController],
  providers: [ContainersService],
})
export class ContainersModule {}
