import {
    Controller,
    UseGuards,
    Get,
    HttpException,
    Post,
    Body,
    Delete,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { YachtConfig } from '@yacht/types';
import { DeleteServerDto, NewServerDto } from './servers.dto';

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
            const servers = await this.serversService.getServerConfig();
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
    @ApiOperation({
        description: 'Add a new server.',
    })
    async writeSettings(@Body() body: NewServerDto): Promise<YachtConfig> {
        try {
            console.log(body)
            const added = await this.serversService.addServerToConfig(
                body.name,
                body.options,
                body.keyname,
                body.copyToServer
            );
            return added;
        } catch (err) {
            // Error Handling
            if (err.statusCode) {
                throw new HttpException(err.message, err.statusCode);
            } else {
                throw new HttpException(err.message, 500);
            }
        }
    }
    @Delete()
    @ApiOperation({
        description: 'Delete a server.',
    })
    async deleteServer(@Body() body: DeleteServerDto): Promise<YachtConfig> {
        try {
            const deleted = await this.serversService.removeServerFromConfig(
                body.name,
                body.removeLocalKey,
                body.removeRemoteKey
            );
            return deleted;
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
