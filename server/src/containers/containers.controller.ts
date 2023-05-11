import {
  Controller,
  Get,
  Param,
  HttpException,
  Sse,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Container, CreateContainerForm, ServerContainers } from '@yacht/types';
import { ContainerInfoDTO, ContainerProcessesDTO } from './classes';
import { ContainersService } from './containers.service';
import { PassThrough as StreamPassThrough } from 'stream';
import { Observable, fromEvent, map } from 'rxjs';
import { AdminGuard } from '../common/guards/admin.guard';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@ApiTags('Containers')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Get()
  @ApiCreatedResponse({
    description: 'List all containers.',
    type: [ContainerInfoDTO],
  })
  async getContainers(): Promise<ServerContainers> {
    try {
      const containers = await this.containersService.getContainers();
      return containers;
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Post('/create')
  @ApiCreatedResponse({
    description: 'Create a new container.',
    type: ContainerInfoDTO,
  })
  async createContainer(@Body() body: CreateContainerForm): Promise<Container> {
    try {
      return await this.containersService.createContainer(body.server, body);
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }

  @Sse('/stats')
  async streamContainerStats(): Promise<Observable<MessageEvent>> {
    try {
      return await this.containersService.streamBaseContainerStats();
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Get('info/:server/:id')
  @ApiCreatedResponse({
    description: 'Get inspect information of one container.',
    type: ContainerInfoDTO,
  })
  async getContainerByName(
    @Param('server') server: string,
    @Param('id') id: string,
  ): Promise<Container> {
    try {
      return await this.containersService.getContainer(server, id);
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Get('info/:server/:id/processes')
  @ApiCreatedResponse({
    description: 'Get processes in container.',
    type: ContainerProcessesDTO,
  })
  async getContainerProcesses(
    @Param('server') server: string,
    @Param('id') id: string,
  ): Promise<ContainerProcessesDTO> {
    try {
      return await this.containersService.getContainerProcess(server, id);
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Get('info/:server/:id/static_stats')
  @ApiCreatedResponse({
    description: 'Get processes in container.',
    type: ContainerProcessesDTO,
  })
  async getContainerStats(
    @Param('server') server: string,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      return await this.containersService.getContainerStats(server, id);
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Sse('info/:server/:id/logs')
  async streamContainerLogs(
    @Param('server') server: string,
    @Param('id') id: string,
  ): Promise<Observable<MessageEvent>> {
    try {
      const containerStream: StreamPassThrough =
        await this.containersService.getContainerLogs(id);
      return fromEvent(containerStream, 'data').pipe(
        map(
          (x: Buffer) =>
            ({
              data: `${x.toString()}`,
            } as MessageEvent),
        ),
      );
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Get('actions/:server/:id/:action')
  @ApiCreatedResponse({
    description: 'Get inspect information of one container.',
  })
  async containerAction(
    @Param('server') server: string,
    @Param('id') id: string,
    @Param('action') action: string,
  ): Promise<Container> {
    try {
      return await this.containersService.getContainerAction(
        server,
        id,
        action,
      );
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
