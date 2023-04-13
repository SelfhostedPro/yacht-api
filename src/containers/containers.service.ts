import { Injectable } from '@nestjs/common';
import Dockerode, { Container, ContainerInfo, ContainerStats } from 'dockerode';
import { PassThrough as StreamPassThrough, Stream, Readable } from 'stream';
import { ContainerProcessesDTO } from './classes';
import { Logger } from '../logger/logger.service';
import { transformStatStream } from '../util/streamConverter'
import { Observable, fromEvent, map } from 'rxjs';
import { formatContainers, formatInspect, ReadableContainerInfo } from '../util/containerFormatter'

@Injectable()
export class ContainersService {
  constructor(private readonly logger: Logger) { }

  async getContainers(): Promise<ReadableContainerInfo[]> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return formatContainers( await docker.listContainers({ all: true }));
  }
  async getContainer(id: string): Promise<ContainerInfo> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return formatInspect( await docker.getContainer(id).inspect());
  }
  async getContainerAction(id: string, action: string): Promise<ContainerInfo> {
    const Docker = require('dockerode');
    const docker = new Docker();
    this.logger.log(`Action: ${action} used on container: ${id}`);
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
  async getContainerStats(id: string): Promise<ContainerStats> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return docker.getContainer(id).stats({ stream: false })
  }

  //     >>>>> Streaming Services <<<<<
  //
  async getContainerLogs(id: string): Promise<StreamPassThrough> {
    const logStream = new StreamPassThrough();

    const Docker = require('dockerode');
    const docker = new Docker();

    const container: Container = await docker.getContainer(id);

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

  async streamBaseContainerStats(): Promise<Observable<MessageEvent>> {
    const statStream = new StreamPassThrough();

    const Docker = require('dockerode');
    const docker: Dockerode = new Docker();
    const containerList = await docker.listContainers()

    for await (const app of containerList) {
      docker.getContainer(app.Id)
        .stats({ stream: true }, function (err, stream: any) {
          stream
            .pipe(transformStatStream)
            .pipe(statStream)
        })
    };
    const observable = fromEvent(statStream, 'data').pipe(
      map(
        (x: Buffer) =>
        ({
          data: `${x.toString()}`,
        } as MessageEvent),
      ),
    );
    return observable
  }
}