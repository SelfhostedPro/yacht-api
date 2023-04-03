import { EventEmitter } from 'events';
import { Injectable } from '@nestjs/common';
import { Container, Exec } from 'dockerode';
import { Duplex } from 'stream';

export type TermSize = { cols: number; rows: number };

export interface WsEventEmitter extends EventEmitter {
  disconnect: () => void;
}

@Injectable()
export class TerminalService {
  /**
   * Create a new terminal session
   * @param id: container id
   */
  async startSession(client: WsEventEmitter, id: string) {
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

    client.on('resize', (data) => {
      container.resize({ h: data.rows, w: data.cols });
    });

    container.exec(cmd, (err, exec: Exec) => {
      const options = {
        Tty: true,
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true,
        hijack: true,
      };
      container.wait((err, data) => {
        client.emit('end', 'ended');
      });
      exec.start(options, (err, stream: Duplex) => {
        stream.on('data', (chunk) => {
          client.emit('show', chunk.toString());
        });

        client.on('cmd', (data) => {
          if (typeof data !== 'object') stream.write(data);
        });
      });
    });
  }
}
