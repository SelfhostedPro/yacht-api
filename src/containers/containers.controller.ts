import { Controller, Get, Param, HttpException, Sse } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { ContainerInfo } from 'dockerode';
import { ContainerInfoDTO, ContainerProcessesDTO } from './classes';
import { ContainersService } from './containers.service';
import { PassThrough as StreamPassThrough } from 'stream';
import { IncomingMessage } from 'http';
import { Observable, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators/';

@ApiTags('containers')
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

  @Sse(':id/logs')
  async streamContainerLogs(@Param('id') id: string): Promise<Observable<any>> {
    try {
      const containerStream: StreamPassThrough =
        await this.containersService.getContainerLogs(id);

      containerStream.on('data', function (chunk) {
        chunk.toString('utf8');
      });
      const test = fromEvent(containerStream, 'data').pipe(
        map((x) => ({ data: { x } } as MessageEvent)),
      );
      test.subscribe((x) => console.log(x));
      return fromEvent(containerStream, 'data').pipe(
        map((x) => ({ data: { x } } as MessageEvent)),
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
