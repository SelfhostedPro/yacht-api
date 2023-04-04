import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { TerminalService, WsEventEmitter } from './terminal.service';

@WebSocketGateway({
  // namespace: 'containers/terminal',
  allowEIO3: true,
  cors: {
    origin: ['*'],
    credentials: false,
  },
})
export class TerminalGateway {
  constructor(private readonly terminalService: TerminalService) {}

  @SubscribeMessage('start-session')
  startTerminalSession(client: WsEventEmitter, payload: string) {
    console.log(payload);
    return this.terminalService.startSession(client, payload);
  }
}
