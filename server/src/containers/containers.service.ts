import { Injectable } from '@nestjs/common';
import Dockerode, { Container as UsableContainer, ContainerStats } from 'dockerode';
import { PassThrough as StreamPassThrough, Transform, pipeline } from 'stream';
import { ContainerProcessesDTO } from './classes';
import { Logger } from '../logger/logger.service';
import { ServersService } from '../servers/servers.service'
import { formatStats } from '../util/streamConverter'
import { Observable, fromEvent, map } from 'rxjs';
import { FixedContainerInspectInfo, normalizeContainer, normalizeContainers, normalizeCreate } from '../util/containerFormatter'
import { Container, ServerContainers, ServerDict, CreateContainerForm } from '@yacht/types';
import { ConfigService } from 'src/config/config.service';
import { promisify } from 'util';
import { DockerStatsStreamer} from '../util/containerStreamers'

@Injectable()
export class ContainersService {
  constructor(
    private readonly logger: Logger,
    private readonly serversService: ServersService,
  ) { }

  async getContainers(): Promise<ServerContainers> {
    const servers: ServerDict = await this.serversService.getServersFromConfig();
    const serverKeys = Object.keys(servers);
    // Get containers from all servers in config
    const serverPromises: Promise<Container[]>[] = serverKeys.map(name =>
      servers[name].listContainers({ all: true }).then(normalizeContainers)
    );
    // Wait for containers to resolve
    const containerArrays = await Promise.all(serverPromises);
    // Assign each container array to it's server
    return serverKeys.reduce((acc, serverName, index) => {
      acc[serverName] = containerArrays[index];
      return acc;
    }, {} as { [serverName: string]: Container[] });
  }

  async getContainer(serverName: string, id: string): Promise<Container> {
    const server: any = await this.serversService.getServerFromConfig(serverName)
    return await normalizeContainer(await server.getContainer(id).inspect())
  }

  async oldGetContainer(id: string): Promise<Container> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return await normalizeContainer(await docker.getContainer(id).inspect());
  }

  async createContainer(serverName: string, form: CreateContainerForm) {
    const server: any = await this.serversService.getServerFromConfig(serverName)
    const test = await normalizeCreate(form)
    console.log(test)
    const complete = await server.createContainer(await normalizeCreate(form))
    console.log(complete)
    return await normalizeContainer(await server.getContainer(form.name).inspect())
  }

  async getContainerAction(serverName: string, id: string, action: string): Promise<Container> {
    // Types are messed up, server = Docker() returned by serversService
    const server: any = await this.serversService.getServerFromConfig(serverName)
    const container = server.getContainer(id);

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

  async getContainerProcess(serverName: string, id: string): Promise<ContainerProcessesDTO> {
    const server: any = await this.serversService.getServerFromConfig(serverName)
    return server.getContainer(id).top();
  }
  async getContainerStats(serverName: string, id: string): Promise<ContainerStats> {
    const server: any = await this.serversService.getServerFromConfig(serverName)
    return server.getContainer(id).stats({ stream: false })
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
    const servers: ServerDict = await this.serversService.getServersFromConfig();
    return new DockerStatsStreamer(servers).streamBaseContainerStats()
  }
}