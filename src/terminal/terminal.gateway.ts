import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { TerminalService, WsEventEmitter } from './terminal.service';
import { WsAdminGuard } from 'src/common/guards/ws-admin-guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(WsAdminGuard)
@WebSocketGateway({
  // namespace: 'containers/terminal',
  allowEIO3: true,
  cors: {
    origin: ['*'],
    credentials: true,
  },
})
export class TerminalGateway {
  constructor(private readonly terminalService: TerminalService) {}

  @SubscribeMessage('start-session')
  startTerminalSession(client: WsEventEmitter, payload: string) {
    return this.terminalService.startSession(client, payload);
  }
}
