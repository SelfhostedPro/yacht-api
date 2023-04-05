import { Module } from '@nestjs/common';
import { ContainersController } from './containers.controller';
import { ContainersService } from './containers.service';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    LoggerModule,
    AuthModule,
  ],
  controllers: [ContainersController],
  providers: [ContainersService],
})
export class ContainersModule {}
