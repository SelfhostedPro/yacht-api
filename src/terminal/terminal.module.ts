import { Module } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { TerminalGateway } from './terminal.gateway';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [TerminalService, TerminalGateway],
})

export class TerminalModule {}
