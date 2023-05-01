import {
  Controller,
  Get,
  Param,
  HttpException,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Container } from '@yacht/types';
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
  constructor(private readonly containersService: ContainersService) { }

  @Get()
  @ApiCreatedResponse({
    description: 'List all containers.',
    type: [ContainerInfoDTO],
  })
  async getContainers(): Promise<Container[]> {
    try {
      return await this.containersService.getContainers();
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

  @Get('info/:id')
  @ApiCreatedResponse({
    description: 'Get inspect information of one container.',
    type: ContainerInfoDTO,
  })
  async getContainerByName(@Param('id') id: string): Promise<Container> {
    try {
      return await this.containersService.getContainer(id);
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Get('info/:id/processes')
  @ApiCreatedResponse({
    description: 'Get processes in container.',
    type: ContainerProcessesDTO,
  })
  async getContainerProcesses(
    @Param('id') id: string,
  ): Promise<ContainerProcessesDTO> {
    try {
      return await this.containersService.getContainerProcess(id);
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Get('info/:id/static_stats')
  @ApiCreatedResponse({
    description: 'Get processes in container.',
    type: ContainerProcessesDTO,
  })
  async getContainerStats(
    @Param('id') id: string,
  ): Promise<any> {
    try {
      return await this.containersService.getContainerStats(id);
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Sse('info/:id/logs')
  async streamContainerLogs(
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
  @Get('actions/:id/:action')
  @ApiCreatedResponse({
    description: 'Get inspect information of one container.',
  })
  async containerAction(
    @Param('id') id: string,
    @Param('action') action: string,
  ): Promise<Container> {
    try {
      return await this.containersService.getContainerAction(id, action);
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