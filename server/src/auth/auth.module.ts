import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { AccessTokenStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WsGuard } from '../common/guards/ws.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { WsAdminGuard } from '../common/guards/ws-admin-guard';
import { RefreshTokenStrategy } from './refresh.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.secrets.accessSecret,
        signOptions: {
          expiresIn: configService.ui.sessionTimeout,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    LoggerModule,
    UsersModule,
  ],
  providers: [
    AuthService,
    UsersService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    WsGuard,
    WsAdminGuard,
    AdminGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
