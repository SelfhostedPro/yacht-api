import {
  Controller,
  Get,
  InternalServerErrorException,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { ContainerInfo } from 'dockerode';
import { ContainerInfoDTO } from './classes';
import { ContainersService } from './containers.service';

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
      throw new InternalServerErrorException(err.code, {
        cause: new Error(),
        description: err.message,
      });
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
      throw new InternalServerErrorException(err.code, {
        cause: new Error(),
        description: err.message,
      });
    }
  }
  @Get(':id/:action')
  @ApiCreatedResponse({
    description: 'Get inspect information of one container.',
    type: String,
  })
  async containerAction(
    @Param('id') id: string,
    @Param('action') action: string,
  ): Promise<string> {
    try {
      await this.containersService.containerAction(id, action);
      return 'sucess';
    } catch (err) {
      throw new BadRequestException(err.message, {
        cause: new Error(),
        description: err.message,
      });
    }
  }
}
