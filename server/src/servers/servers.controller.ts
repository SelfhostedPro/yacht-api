import { Controller, UseGuards, Get, HttpException } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { YachtConfig } from '@yacht/types';

@ApiTags('Servers')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('servers')
export class ServersController {
    constructor(private readonly serversService: ServersService) { }

    @Get()
    @ApiCreatedResponse({
        description: 'List all containers.',
    })
    async getContainers(): Promise<YachtConfig['base']['servers']> {
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

}
