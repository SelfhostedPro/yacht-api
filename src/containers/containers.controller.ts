import {
  Controller,
  Get,
  InternalServerErrorException,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContainerInfo } from 'dockerode';
import { ContainersService } from './containers.service';

@ApiTags('containers')
@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Get()
  async getContainers(): Promise<Array<ContainerInfo>> {
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
  async getContainerByName(
    @Param('id') id: string,
  ): Promise<ContainerInfo> {
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
  async containerAction(
    @Param('id') id: string,
    @Param('action') action: string
  ): Promise<string> {
    try {
      await this.containersService.containerAction(id, action);
      return 'sucess'
    } catch (err) {
      throw new BadRequestException(err.message, {
        cause: new Error(),
        description: err.message,
      });
    }
  }
}
