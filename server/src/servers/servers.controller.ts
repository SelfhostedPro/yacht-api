import { Controller, UseGuards, Get, HttpException, Post, Body } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { YachtConfig } from '@yacht/types';
import { NewServer } from './servers.dto';

@ApiTags('Servers')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('servers')
export class ServersController {
    constructor(private readonly serversService: ServersService) { }

    @Get()
    @ApiCreatedResponse({
        description: 'List all servers.',
    })
    async getServers(): Promise<YachtConfig['base']['servers']> {
        try {
            const servers = await this.serversService.getServerConfig()
            return servers;
        } catch (err) {
            // Error Handling
            if (err.statusCode) {
                throw new HttpException(err.message, err.statusCode);
            } else {
                throw new HttpException(err.message, 500);
            }
        }
    }
    @Post()
    @ApiCreatedResponse({
        description: 'Add a new server.',
    })
    async writeSettings(
        @Body() server: NewServer,
    ): Promise<YachtConfig> {
        try {
            const added = await this.serversService.addServerToConfig(server.name, server.options)
            return added
        } catch (err) {
            // Error Handling
            if (err.statusCode) {
                throw new HttpException(err.message, err.statusCode);
            } else {
                throw new HttpException(err.message, 500);
            }
        }
    }
}
