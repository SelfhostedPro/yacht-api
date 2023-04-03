import { Module } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { NodePtyModule } from './node-pty.module';


@Module({
  providers: [TerminalService],
  imports: [NodePtyModule]
})
export class TerminalModule {}
