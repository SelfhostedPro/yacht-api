import { Injectable } from '@nestjs/common';
import {
  ImageInfo,
  ImageInspectInfo,
  NetworkInfo,
  NetworkInspectInfo,
  VolumeInspectInfo,
} from 'dockerode';
import { Logger } from '../common/logger/logger.service';
import { ServersService } from '../servers/servers.service';
import {
  ServerDict,
  ServerImages,
  ServerNetworks,
  ServerVolumes,
} from '@yacht/types';

@Injectable()
export class ResourcesService {
  constructor(
    private readonly logger: Logger,
    private readonly serversService: ServersService,
  ) {}

  async getImages(): Promise<ServerImages> {
    const servers: ServerDict =
      await this.serversService.getServersFromConfig();
    const serverKeys = Object.keys(servers);
    // Get containers from all servers in config
    const serverPromises: Promise<ImageInfo[]>[] = serverKeys.map((name) =>
      servers[name].listImages({ all: true, digests: true }),
    );
    // Wait for containers to resolve
    const imageArrays = await Promise.all(serverPromises);
    // Assign each container array to it's server
    return serverKeys.reduce((acc, serverName, index) => {
      acc[serverName] = imageArrays[index];
      return acc;
    }, {} as { [serverName: string]: ImageInfo[] });
  }

  async getImage(serverName: string, id: string): Promise<ImageInspectInfo> {
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    return await server.getImage(id).inspect();
  }

  async getVolumes(): Promise<ServerVolumes> {
    const servers: ServerDict =
      await this.serversService.getServersFromConfig();
    const serverKeys = Object.keys(servers);
    // Get containers from all servers in config
    const serverPromises: Promise<VolumeInspectInfo[]>[] = serverKeys.map(
      (name) =>
        servers[name]
          .listVolumes({ all: true })
          .then((volumes) => volumes.Volumes),
    );
    // Wait for containers to resolve
    const imageArrays = await Promise.all(serverPromises);
    // Assign each container array to it's server
    return serverKeys.reduce((acc, serverName, index) => {
      acc[serverName] = imageArrays[index];
      return acc;
    }, {} as { [serverName: string]: VolumeInspectInfo[] });
  }

  async getVolume(serverName: string, id: string): Promise<VolumeInspectInfo> {
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    return await server.getVolume(id).inspect();
  }

  async getNetworks(): Promise<ServerNetworks> {
    console.log('getting networks')
    const servers: ServerDict =
      await this.serversService.getServersFromConfig();
      console.log(servers)
    const serverKeys = Object.keys(servers);
    // Get containers from all servers in config
    const serverPromises: Promise<NetworkInspectInfo[]>[] = serverKeys.map(
      (name) => servers[name].listNetworks({ all: true }),
    );
    // Wait for containers to resolve
    const networkArrays = await Promise.all(serverPromises);
    // Assign each container array to it's server
    return serverKeys.reduce((acc, serverName, index) => {
      acc[serverName] = networkArrays[index];
      return acc;
    }, {} as { [serverName: string]: NetworkInspectInfo[] });
  }

  async getNetwork(serverName: string, id: string): Promise<NetworkInfo> {
    const server: any = await this.serversService.getServerFromConfig(
      serverName,
    );
    return await server.getContainer(id).inspect();
  }
}
