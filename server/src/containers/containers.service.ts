import { Injectable } from '@nestjs/common';
import Dockerode, {
  Container as UsableContainer,
  ContainerStats,
} from 'dockerode';
import { PassThrough as StreamPassThrough } from 'stream';
import { ContainerProcessesDTO } from './classes';
import { Logger } from '../common/logger/logger.service';
import { ServersService } from '../servers/servers.service';
import { Observable } from 'rxjs';
import {
  normalizeContainer,
  normalizeContainers,
  normalizeCreate,
} from '../util/containerFormatter';
import {
  Container,
  ServerContainers,
  ServerDict,
  CreateContainerForm,
} from '@yacht/types';
import { DockerStatsStreamer } from '../util/containerStreamers';

@Injectable()
export class ContainersService {
  constructor(
    private readonly logger: Logger,
    private readonly serversService: ServersService,
  ) {
    this.logger.setContext(ContainersService.name)
  }

  async getContainers(): Promise<ServerContainers> {
    try {
      const servers: ServerDict = await this.serversService.getServersFromConfig();
      const serverKeys = Object.keys(servers);
      // Get containers from all servers in config
      const serverPromises: Promise<Container[]>[] = serverKeys.map(async (name) => {
        const containers = await servers[name].listContainers({ all: true }).catch((error) => {
          this.logger.error(`Error getting containers for server '${name}': ${error.message}`);
          return [];
        });
        return normalizeContainers(containers);
      });
      // Wait for containers to resolve
      const containerArrays = await Promise.all(serverPromises);
      // Assign each container array to its server
      return serverKeys.reduce((acc, serverName, index) => {
        acc[serverName] = containerArrays[index];
        return acc;
      }, {} as { [serverName: string]: Container[] });
    } catch (error) {
      this.logger.error(`Error getting containers: ${error.message}`);
      throw new Error(`Error getting containers: ${error.message}`);
    }
  }


  async getContainer(serverName: string, id: string): Promise<Container> {
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    return await normalizeContainer(await server.getContainer(id).inspect());
  }

  async oldGetContainer(id: string): Promise<Container> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return await normalizeContainer(await docker.getContainer(id).inspect());
  }

  async createContainer(serverName: string, form: CreateContainerForm) {
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    const pullStream = await server.pull(form.image);
    await new Promise((res) => server.modem.followProgress(pullStream, res));
    const test = await server
      .createContainer(await normalizeCreate(form))
      .catch((err) => {
        throw err;
      });
    await server
      .getContainer(form.name)
      .start()
      .catch((err) => {
        throw err;
      });
    return await normalizeContainer(
      await server.getContainer(form.name).inspect(),
    );
  }

  async getContainerAction(
    serverName: string,
    id: string,
    action: string,
  ): Promise<Container> {
    // Types are messed up, server = Docker() returned by serversService
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    const container = server.getContainer(id);

    const actions: { [key: string]: (res) => Promise<any> } = {
      start: (res) => container.start(res),
      stop: (res) => container.stop(res),
      pause: (res) => container.pause(res),
      unpause: (res) => container.unpause(res),
      kill: (res) => container.kill(res),
      remove: (res) => container.remove({ force: true }, res),
      restart: (res) => container.restart(res),
    };
    if (action in actions) {
      await new Promise((res) => actions[action](res));
      const containerInfo = await normalizeContainer(await container.inspect());
      this.logger.log(
        `Action: ${action} used on container ${containerInfo.name}: ${containerInfo.shortId}`,
      );
      return containerInfo;
    } else {
      throw new Error('Error: Action not found.');
    }
  }

  async getContainerProcess(
    serverName: string,
    id: string,
  ): Promise<ContainerProcessesDTO> {
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    return server.getContainer(id).top();
  }
  async getContainerStats(
    serverName: string,
    id: string,
  ): Promise<ContainerStats> {
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    return server.getContainer(id).stats({ stream: false });
  }

  //     >>>>> Streaming Services <<<<<
  //
  async getContainerLogs(id: string): Promise<StreamPassThrough> {
    const logStream = new StreamPassThrough();

    const Docker = require('dockerode');
    const docker = new Docker();

    const container: UsableContainer = await docker.getContainer(id);

    container.logs(
      { follow: true, stdout: true, stderr: true, timestamps: false },
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
    return this.serversService.getServersFromConfig().then((servers: ServerDict) => {
      return new DockerStatsStreamer(servers).streamBaseContainerStats();
    }).catch((error) => {
      throw error;
    });
  }
}
