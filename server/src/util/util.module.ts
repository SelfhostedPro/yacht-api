import { Module } from '@nestjs/common';
import { SSHManagerService } from './sshManager.service';
import { LoggerModule } from '../common/logger/logger.module';
import { ConfigModule } from '../config/config.module';
import { ContainerFormatterService } from './containerFormatter.service';

@Module({
    imports: [ConfigModule, LoggerModule],
    providers: [SSHManagerService, ContainerFormatterService],
    exports: [SSHManagerService, ContainerFormatterService],
})
export class UtilModule { }
