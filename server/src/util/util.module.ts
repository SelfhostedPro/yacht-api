import { Module } from '@nestjs/common';
import { SSHManagerService } from './sshManager.service';
import { LoggerModule } from '../common/logger/logger.module';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [ConfigModule, LoggerModule],
    providers: [SSHManagerService],
    exports: [SSHManagerService],
})
export class UtilModule { }
