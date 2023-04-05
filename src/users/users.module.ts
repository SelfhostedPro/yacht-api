import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersController } from './users.controller';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
