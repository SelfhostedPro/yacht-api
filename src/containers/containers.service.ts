import { Injectable } from '@nestjs/common';
import { Container, ContainerInfo } from 'dockerode';
import { ContainerProcessesDTO } from './classes';

@Injectable()
export class ContainersService {
  async getContainers(): Promise<ContainerInfo[]> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return docker.listContainers({ all: true });
  }
  async getContainer(id: string): Promise<ContainerInfo> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return docker.getContainer(id).inspect();
  }
  async getContainerAction(id: string, action: string): Promise<ContainerInfo> {
    const Docker = require('dockerode');
    const docker = new Docker();
    switch (action) {
      case 'start':
        return await docker.getContainer(id).start();
      case 'stop':
        return await docker.getContainer(id).stop();
      case 'pause':
        return await docker.getContainer(id).pause();
      case 'unpause':
        return await docker.getContainer(id).unpause();
      case 'kill':
        return await docker.getContainer(id).kill();
      case 'remove':
        return await docker.getContainer(id).remove({ force: true });
      case 'restart':
        return await docker.getContainer(id).restart();
      default:
        throw new Error('Error: Action not found.');
    }
  }
  async getContainerProcess(id: string): Promise<ContainerProcessesDTO> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return docker.getContainer(id).top();
  }
  async getContainerLogs(id: string): Promise<any> {
    const Docker = require('dockerode');
    const docker = new Docker();

    const Stream = require('stream');
    var logStream: any = new Stream.Readable();

    const containerLogs = await docker
      .getContainer(id)
      .logs(
        { follow: true, stdout: true, stderr: true },
        async function (err: any, stream: any) {
          await containerLogs.modem.demuxStream(stream, logStream, logStream);
        },
      );
    return await logStream;
  }
}
