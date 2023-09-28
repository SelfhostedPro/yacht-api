import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { TerminalService, WsEventEmitter } from './terminal.service';
import { WsAccessTokenGuard } from '../common/guards/wsAccessToken.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io'
import { Container, Exec } from 'dockerode';
import { Duplex } from 'stream';
import { Injectable, Scope } from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/exceptions/ws-exception.filter';
import { PassThrough as StreamPassThrough } from 'stream';

@UseGuards(WsAccessTokenGuard)
@UseFilters(WsExceptionFilter)
@Injectable({ scope: Scope.REQUEST })
@WebSocketGateway({
  namespace: 'terminal',
  transports: ['websocket'],
  allowEIO3: true,
  cors: {
    origin: ['*'],
    credentials: true,
  },
})
export class TerminalGateway implements OnGatewayConnection {
  private cliSession: Duplex;
  constructor(private readonly terminalService: TerminalService) { }
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Container Terminal Connection Started...')
    client.send('Connection Started...')
  }

  @SubscribeMessage('start-session')
  async startTerminalSession(@MessageBody() id: string,
    @ConnectedSocket() client: Socket) {
    const Docker = require('dockerode');
    const docker = new Docker();
    // get the container
    const container: Container = await docker.getContainer(id);
    // form container command
    const cmd = {
      AttachStdout: true,
      AttachStderr: true,
      AttachStdin: true,
      Tty: true,
      Cmd: ['/bin/bash'],
    };
    container.exec(cmd, (err, exec: Exec) => {
      const options = {
        Tty: true,
        follow: true,
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true,
        hijack: true,
      };
      client.on('connection', () => {
        client.send(`Connected to container: ${id}`);
      })
      exec.start(options, (err, stream: Duplex) => {
        const containerStream = new StreamPassThrough();

        container.modem.demuxStream(stream, containerStream, containerStream);
        stream.on('data', (chunk: Buffer) => {
          client.emit('container', chunk.toString('utf8'));
        })
        client.on('close', () => {
          console.log(`Connection to ${id} Closed.`)
          stream.destroy()
        })
        containerStream.on('close', () => {
          console.log(`Stream from ${id} Destroyed.`)
        })
        this.cliSession = stream
      })
    })
  }

  @SubscribeMessage('cmd')
  handleCommand(@MessageBody() data: string) {
    this.cliSession.write(data, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }

  @SubscribeMessage('connection')
  connectionInit(@ConnectedSocket() client: Socket) {
    client.emit('show', 'Connected to container.');
    console.log(client.eventNames())
  }

  @SubscribeMessage('exception')
  testException(@MessageBody() data: string) {
    throw new WsException('Invalid credentials.')
  }

  handleDisconnect(client: Socket) {
    console.log('Container Terminal Connection Closed...')
  }
}
