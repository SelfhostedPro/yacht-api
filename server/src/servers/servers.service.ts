import { Injectable } from '@nestjs/common';
import { Logger } from '../common/logger/logger.service';
import { ConfigService } from '../config/config.service';
import { ServerDict, YachtConfig, serverConfig } from '@yacht/types';
import { randomBytes } from 'crypto';
import { NewServerOptions } from './servers.dto';
import * as Docker from 'dockerode';
import { SSHManagerService } from '../util/sshManager.service';

@Injectable()
export class ServersService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly keyManager: SSHManagerService,
  ) {
    this.logger.setContext(ServersService.name);
  }
  async createDockerInstance(
    server: serverConfig,
    privateKey?: string,
  ): Promise<Docker | null> {
    const options = privateKey
      ? { ...server.options, sshOptions: { privateKey } }
      : server.options;
    const newServer = new Docker(options);
    try {
      await newServer.info();
      return newServer;
    } catch (e) {
      this.logger.error(
        `Error connecting to ${server.name} (${
          server.options.host && server.options.port
            ? server.options.host + ':' + server.options.port
            : server.options.socketPath
        }) => ${e}`,
      );
      return null;
    }
  }
  async getServersFromConfig(): Promise<ServerDict> {
    const servers = this.configService.yachtConfig.base.servers;
    const result: ServerDict = {};
    const serverPromises = servers.map(async (server) => {
      if (server.options.protocol === 'ssh' && server.key) {
        const privateKey = await this.keyManager.getPrivateKey(server.key);
        const newServer = await this.createDockerInstance(server, privateKey);
        if (newServer) {
          result[server.name] = newServer;
        }
      } else if (server.options.protocol === 'ssh' && !server.key) {
        this.logger.error(
          `SSH key not found for ${server.name} please try removing and re-adding the server`,
        );
      } else {
        const newLocal = await this.createDockerInstance(server);
        if (newLocal) {
          result[server.name] = newLocal;
        }
      }
    });
    await Promise.all(serverPromises);
    return result;
  }

  async getServerFromConfig(name: string): Promise<typeof Docker> {
    const servers = await this.getServersFromConfig();
    // @ts-ignore
    return servers[name];
  }
  async getServerConfig(): Promise<YachtConfig['base']['servers']> {
    return this.configService.yachtConfig.base.servers;
  }
  async addServerToConfig(
    name: string,
    options: NewServerOptions,
    keyName?: string,
    copyToServer?: boolean,
  ): Promise<YachtConfig> {
    const servers = await this.getServerConfig();
    // Check for existing servers
    let serverExists = false;
    this.logger.log(`Checking if server ${name} already exists`);
    for (const server of servers) {
      if (server.name === name) {
        serverExists = true;
        break;
      }
    }
    if (serverExists) {
      this.logger.error('Server already exists');
      throw new Error('Server already exists');
    }
    const currentKeys = await this.keyManager.getAllKeys();
    const keyExists = currentKeys.includes(keyName);
    // Generate a new ssh key and copy it to the remote server
    if (options.protocol === 'ssh' && keyName && !keyExists && copyToServer) {
      // Generate random passphrase and create SSH key
      this.logger.log(`Generating SSH key for ${name}`);
      await this.keyManager.createSSHKey(
        keyName,
        randomBytes(32).toString('hex'),
      );
      this.logger.log(`Copying SSH key to ${name}`);
      try {
        await this.keyManager.copyPublicKeyToRemoteServer(
          keyName,
          options.host,
          options.port,
          options.username,
          options.password,
        );
      } catch (e) {
        this.logger.log(`Error copying SSH key to ${name}: ${e}`);
        this.keyManager.removeSSHKey(keyName);
        throw new Error(`Error copying SSH key to ${name}: ${e}`);
      }
    } else if (
      options.protocol === 'ssh' &&
      keyName &&
      !keyExists &&
      !copyToServer
    ) {
      this.logger.log(`Generating SSH key for ${name}`);
      await this.keyManager.createSSHKey(
        keyName,
        randomBytes(32).toString('hex'),
      );
    } else if (options.protocol === 'ssh' && keyName && copyToServer) {
      try {
        await this.keyManager.copyPublicKeyToRemoteServer(
          keyName,
          options.host,
          options.port,
          options.username,
          options.password,
        );
      } catch (e) {
        this.logger.error(`Error copying SSH key to ${name}: ${e}`);
        this.keyManager.removeSSHKey(keyName);
        throw new Error(`Error copying SSH key to ${name}: ${e}`);
      }
    }
    delete options.password;
    servers.push({ name, options, key: keyName });
    const currentConfig = this.configService.yachtConfig;
    currentConfig.base.servers = servers;

    return this.configService.writeConfig(currentConfig);
  }
  async removeServerFromConfig(
    name: string,
    removeRemoteKey: boolean,
    removeLocalKey: boolean,
  ): Promise<YachtConfig> {
    const servers = await this.getServerConfig();
    // Check for existing servers
    let serverExists = false;
    let serverToDelete = null;
    this.logger.debug(`Checking if server ${name} already exists`);
    for (const server of servers) {
      if (server.name === name) {
        this.logger.warn(
          `Removing server ${name} (${
            server.options.host && server.options.port
              ? server.options.host + ':' + server.options.port
              : server.options.socketPath
          })})`,
        );
        serverExists = true;
        serverToDelete = server;
        const index = servers.indexOf(server);
        servers.splice(index, 1);
        break;
      }
    }
    if (!serverExists) {
      this.logger.error('Server not found');
      throw new Error('Server not found');
    }
    if (serverToDelete.options.protocol === 'ssh' && removeRemoteKey) {
      await this.keyManager.removePublicKeyFromRemoteServer(
        serverToDelete.key,
        serverToDelete.options.host,
        serverToDelete.options.port,
        serverToDelete.options.username,
      );
    }

    if (serverToDelete.options.protocol === 'ssh' && removeLocalKey) {
      await this.keyManager.removeSSHKey(serverToDelete.key);
    }
    delete servers[name];
    const currentConfig = this.configService.yachtConfig;
    currentConfig.base.servers = servers;
    this.logger.success(`Server ${name} removed`);
    return this.configService.writeConfig(currentConfig);
  }
}
