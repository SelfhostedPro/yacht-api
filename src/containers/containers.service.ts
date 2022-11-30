import { Injectable } from '@nestjs/common';
import { Container, ContainerInfo } from 'dockerode';
import { PassThrough as StreamPassThrough } from 'stream';
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
  async getContainerLogs(id: string): Promise<StreamPassThrough> {
    const logStream = new StreamPassThrough();

    const Docker = require('dockerode');
    const docker = new Docker();

    var container: Container = await docker.getContainer(id);

    container.logs(
      { follow: true, stdout: true, stderr: true },
      function (err: any, stream: any) {
        container.modem.demuxStream(stream, logStream, logStream);
        stream.on('end', function () {
          logStream.end('!stop!');
        });
      },
    );
    return logStream;
  }

  async getContainerStats(id: string): Promise<StreamPassThrough> {
    const statStream = new StreamPassThrough();

    const Docker = require('dockerode');
    const docker = new Docker();

    var container: Container = await docker.getContainer(id);

    container.stats({ stream: true }, function (err: any, stream: any) {
      container.modem.demuxStream(stream, statStream, statStream);
      stream.on('end', function () {
        statStream.end('!stop!');
      });
    });
    return statStream;
  }
}
