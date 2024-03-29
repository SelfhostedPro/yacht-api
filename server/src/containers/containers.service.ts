import { Injectable } from '@nestjs/common';
import { Container as UsableContainer, ContainerStats } from 'dockerode';
import { PassThrough as StreamPassThrough } from 'stream';
import { ContainerProcessesDTO } from './classes';
import { Logger } from 'src/common/logger/logger.service';
import { ServersService } from 'src/servers/servers.service';
import { Observable } from 'rxjs';
import { ContainerFormatterService } from 'src/util/containerFormatter.service';
import {
  Container,
  ServerContainers,
  ServerDict,
  CreateContainerForm,
} from '@yacht/types';
import { DockerStatsStreamer } from 'src/util/containerStreamers';

@Injectable()
export class ContainersService {
  constructor(
    private readonly logger: Logger,
    private readonly serversService: ServersService,
    private readonly containerFormatterService: ContainerFormatterService,
  ) {
    this.logger.setContext(ContainersService.name);
  }

  async getContainers(): Promise<ServerContainers> {
    try {
      const servers: ServerDict =
        await this.serversService.getServersFromConfig();
      const serverKeys = Object.keys(servers);
      // Get containers from all servers in config
      const serverPromises: Promise<Container[]>[] = serverKeys.map(
        async (name) => {
          const containers = await servers[name]
            .listContainers({ all: true })
            .catch((error) => {
              this.logger.error(
                `Error getting containers for server '${name}': ${error.message}`,
              );
              return [];
            });
          return this.containerFormatterService.normalizeContainers(containers);
        },
      );
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
    return await this.containerFormatterService.normalizeContainer(
      await server.getContainer(id).inspect(),
    );
  }

  async oldGetContainer(id: string): Promise<Container> {
    const Docker = require('dockerode');
    const docker = new Docker();
    return await this.containerFormatterService.normalizeContainer(
      await docker.getContainer(id).inspect(),
    );
  }

  async createContainer(serverName: string, form: CreateContainerForm) {
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    this.logger.log(
      `Creating container: ${form.name} from image: ${form.image} on server: ${serverName}`,
    );
    const pullStream = await server.pull(form.image);
    await new Promise((res) => server.modem.followProgress(pullStream, res));
    this.logger.log(`Image: ${form.image} pulled successfully.`);
    const test = await server
      .createContainer(
        await this.containerFormatterService.normalizeCreate(form),
      )
      .catch((err) => {
        throw err;
      });
    await server
      .getContainer(form.name)
      .start()
      .catch((err) => {
        throw err;
      });
    this.logger.success(
      `Container ${form.name} started successfully on ${serverName}.`,
    );
    return await this.containerFormatterService.normalizeContainer(
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
    const containerInfo =
      await this.containerFormatterService.normalizeContainer(
        await container.inspect(),
      );

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
      this.logger.success(
        `Action: ${action} used on container ${containerInfo.name}: ${containerInfo.shortId}`,
      );
      action !== 'remove'
        ? await this.containerFormatterService.normalizeContainer(
            await container.inspect(),
          )
        : null;
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
  async getContainerLogs(
    serverName: string,
    id: string,
    timestamps: boolean,
  ): Promise<StreamPassThrough> {
    const logStream = new StreamPassThrough();
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    const container: UsableContainer = await server.getContainer(id);

    container.logs(
      {
        follow: true,
        stdout: true,
        stderr: true,
        timestamps: timestamps,
        tail: 100,
      },
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
    return this.serversService
      .getServersFromConfig()
      .then((servers: ServerDict) => {
        return new DockerStatsStreamer(servers).streamBaseContainerStats();
      })
      .catch((error) => {
        throw error;
      });
  }
}
