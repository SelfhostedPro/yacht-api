import { Injectable } from '@nestjs/common';
import Dockerode, { Container as UsableContainer, ContainerInfo, ContainerStats } from 'dockerode';
import { PassThrough as StreamPassThrough, Transform } from 'stream';
import { ContainerProcessesDTO } from './classes';
import { Logger } from '../logger/logger.service';
import { formatStats } from '../util/streamConverter'
import { Observable, fromEvent, map } from 'rxjs';
import { normalizeContainer, normalizeContainers, ReadableContainerInfo } from '../util/containerFormatter'
import { Container } from '@yacht/types';

@Injectable()
export class ContainersService {
  constructor(private readonly logger: Logger) { }

  async getContainers(): Promise<Container[]> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return await normalizeContainers(await docker.listContainers({ all: true }));
  }
  async getContainer(id: string): Promise<Container> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return await normalizeContainer(await docker.getContainer(id).inspect());
  }
  async getContainerAction(id: string, action: string): Promise<Container> {
    const Docker = require('dockerode');
    const docker = new Docker();
    const container = docker.getContainer(id);

    const actions: { [key: string]: () => Promise<any> } = {
      start: () => container.start(),
      stop: () => container.stop(),
      pause: () => container.pause(),
      unpause: () => container.unpause(),
      kill: () => container.kill(),
      remove: () => container.remove({ force: true }),
      restart: () => container.restart(),
    };
    if (action in actions) {
      const containerInfo = await normalizeContainer(await container.inspect())
      this.logger.log(`Action: ${action} used on container ${containerInfo.name}: ${containerInfo.shortId}`);
      await actions[action]();
      return containerInfo;
    } else {
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

    const container: UsableContainer = await docker.getContainer(id);

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
    const transformStatStream = new Transform({
      objectMode: true, transform(chunk, enc, callback) {
        this.push(formatStats(chunk))
        callback()
      }
    })
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