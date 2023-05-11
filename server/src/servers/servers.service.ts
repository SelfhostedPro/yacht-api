import { Injectable } from '@nestjs/common';
import { Logger } from 'src/logger/logger.service';
import { ConfigService } from 'src/config/config.service';
import { ServerDict, YachtConfig } from '@yacht/types';
import { randomBytes } from 'crypto';
import { NewServerOptions } from './servers.dto';
import { SSHKeyManager } from '../util/sshKeyManager';
const Docker = require('dockerode');
const keyManager = new SSHKeyManager();

@Injectable()
export class ServersService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) { }
  async getServersFromConfig(): Promise<ServerDict> {
    const servers = this.configService.yachtConfig.base.servers;
    const result: ServerDict = {};
    for (const server of servers) {
      if (server.options.protocol === 'ssh' && server.key) {
        const privateKey = await keyManager.getPrivateKey(server.key);
        // @ts-ignore
        result[server.name] = new Docker({
          protocol: 'ssh',
          host: server.options.host,
          port: server.options.port,
          username: server.options.username,
          sshOptions: { privateKey: privateKey },
        });
      } else if (server.options.protocol === 'ssh' && !server.key) {
        throw new Error(`SSH key not found for ${server.name} please try removing and re-adding the server`);
      }
      else {
        result[server.name] = new Docker(server.options);
      }
    }
    return result;
  }
  async getServerFromConfig(name: string): Promise<typeof Docker> {
    const servers = await this.getServersFromConfig();
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
      throw new Error('Server already exists');
    }
    const currentKeys = await keyManager.getAllKeys()
    const keyExists = currentKeys.includes(keyName)
    // Generate a new ssh key and copy it to the remote server
    if (options.protocol === 'ssh' && keyName && !keyExists && copyToServer) {
      // Generate random passphrase and create SSH key
      this.logger.log(`Generating SSH key for ${name}`);
      await keyManager.createSSHKey(keyName, randomBytes(32).toString('hex'));
      this.logger.log(`Copying SSH key to ${name}`);
      await keyManager.copyPublicKeyToRemoteServer(
        keyName,
        options.host,
        options.port,
        options.username,
        options.password,
      );
    }

    else if (options.protocol === 'ssh' && keyName && !keyExists && !copyToServer) {
      this.logger.log(`Generating SSH key for ${name}`);
      await keyManager.createSSHKey(keyName, randomBytes(32).toString('hex'));
    }

    else if (options.protocol === 'ssh' && keyName && keyExists && copyToServer) {
      await keyManager.copyPublicKeyToRemoteServer(
        keyName,
        options.host,
        options.port,
        options.username,
        options.password,
      );
    }
    delete options.password;
    servers.push({ name, options, key: keyName });
    const currentConfig = this.configService.yachtConfig;
    currentConfig.base.servers = servers;

    return this.configService.writeConfig(currentConfig);
  }
  async removeServerFromConfig(name: string, removeLocalKey: boolean, removeRemoteKey: boolean): Promise<YachtConfig> {
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
      throw new Error('Server not found');
    }
    if (servers[name].options.protocol === 'ssh' && removeLocalKey) {
      await keyManager.removePublicKeyFromRemoteServer(servers[name].key, servers[name].options.host, servers[name].options.port, servers[name].options.username);
      await keyManager.removeSSHKey(servers[name].key);
    } else if (servers[name].options.protocol === 'ssh' && !removeLocalKey && removeRemoteKey) {
      await keyManager.removeSSHKey(servers[name].key);
    }
    delete servers[name];
    const currentConfig = this.configService.yachtConfig;
    currentConfig.base.servers = servers;
    return this.configService.writeConfig(currentConfig);
  }
}
