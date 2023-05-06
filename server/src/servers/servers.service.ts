import { Injectable } from '@nestjs/common';
import { Logger } from 'src/logger/logger.service';
import { ConfigService } from 'src/config/config.service';
import { ServerDict, YachtConfig } from '@yacht/types';
const Docker = require('dockerode')

@Injectable()
export class ServersService {
    constructor(
        private readonly logger: Logger,
        private readonly configService: ConfigService
    ) { }
    async getServersFromConfig(): Promise<ServerDict> {
        return this.configService.yachtConfig.base.servers.reduce(async (accessPromise, server) => {
            const acc = await accessPromise;
            acc[server.name] = new Docker(server.options);
            return acc;
        }, Promise.resolve({} as ServerDict));
    }
    async getServerFromConfig(name: string): Promise<ServerDict> {
        return new Docker(this.configService.yachtConfig.base.servers.find(x => x.name === name).options)
    }
    async getServerConfig(): Promise<YachtConfig['base']['servers']> {
        return this.configService.yachtConfig.base.servers
    }
}
