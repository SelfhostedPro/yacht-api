import { EventEmitter } from 'events';
import { Injectable } from '@nestjs/common';
import { NodePtyService } from './node-pty.service';

export type TermSize = { cols: number; rows: number };

export interface WsEventEmitter extends EventEmitter {
  disconnect: () => void;
}

@Injectable()
export class TerminalService {
  private ending = false;

  constructor(
    private nodePtyService: NodePtyService,
  ) { }

  /**
   * Create a new terminal session
   * @param client
   */
  async startSession(client: WsEventEmitter, size: TermSize) {
    this.ending = false;

    // check if we should use bash or sh
    const shell = '/bin/bash';

    // spawn a new shell
    const term = this.nodePtyService.spawn(shell, [], {
      name: 'xterm-color',
      cols: size.cols,
      rows: size.rows,
    });

    // write to the client
    term.onData((data) => {
      client.emit('stdout', data);
    });

    // let the client know when the session ends
    term.onExit((code) => {
      try {
        if (!this.ending) {
          client.emit('process-exit', code);
        }
      } catch (e) {
        // the client socket probably closed
      }
    });

    // write input to the terminal
    client.on('stdin', (data) => {
      term.write(data);
    });

    // capture resize events
    client.on('resize', (resize: TermSize) => {
      try {
        term.resize(resize.cols, resize.rows);
      } catch (e) { }
    });

    // cleanup on disconnect
    const onEnd = () => {
      this.ending = true;

      client.removeAllListeners('stdin');
      client.removeAllListeners('resize');
      client.removeAllListeners('end');
      client.removeAllListeners('disconnect');

      try {
        term.kill();
      } catch (e) { }
    };

    client.on('end', onEnd.bind(this));
    client.on('disconnect', onEnd.bind(this));
  }
}