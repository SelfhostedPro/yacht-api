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
import { ContainerInfo } from 'dockerode';
import { ContainerInfoDTO, ContainerProcessesDTO, ContainerStatsDTO } from './classes';
import { ContainersService } from './containers.service';
import { PassThrough as StreamPassThrough } from 'stream';
import { Observable, fromEvent, map } from 'rxjs';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('containers')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Get()
  @ApiCreatedResponse({
    description: 'List all containers.',
    type: [ContainerInfoDTO],
  })
  async getContainers(): Promise<ContainerInfo[]> {
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
  @Get(':id')
  @ApiCreatedResponse({
    description: 'Get inspect information of one container.',
    type: ContainerInfoDTO,
  })
  async getContainerByName(@Param('id') id: string): Promise<ContainerInfo> {
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
  @UseGuards(AdminGuard)
  @Get(':id/actions/:action')
  @ApiCreatedResponse({
    description: 'Get inspect information of one container.',
    type: String,
  })
  async containerAction(
    @Param('id') id: string,
    @Param('action') action: string,
  ): Promise<string> {
    try {
      await this.containersService.getContainerAction(id, action);
      return 'sucess';
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Get(':id/processes')
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

  @Get(':id/static_stats')
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

  @Sse(':id/logs')
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

  @Sse(':id/stats')
  async streamContainerStats(
    @Param('id') id: string,
  ): Promise<Observable<MessageEvent>> {
    try {
      const containerStream: any =
        await this.containersService.streamContainerStats(id);
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
}
