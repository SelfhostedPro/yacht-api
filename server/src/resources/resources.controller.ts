import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@ApiTags('Resources')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  // @Post()
  // create(@Body() createResourceDto: CreateResourceDto) {
  //   return this.resourcesService.create(createResourceDto);
  // }

  @Get('images')
  getImages() {
    return this.resourcesService.getImages();
  }

  @Get('images/:server/:id')
  getImage(@Param('server') server: string, @Param('id') id: string) {
    return this.resourcesService.getImage(server, id);
  }

  @Get('volumes')
  getVolumes() {
    return this.resourcesService.getVolumes();
  }

  @Get('volumes/:server/:id')
  getVolume(@Param('server') server: string, @Param('id') id: string) {
    return this.resourcesService.getVolume(server, id);
  }

  @Get('networks')
  getNetworks() {
    return this.resourcesService.getNetworks();
  }

  @Get('networks/:server/:id')
  getNetwork(@Param('server') server: string, @Param('id') id: string) {
    return this.resourcesService.getNetwork(server, id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
  //   return this.resourcesService.update(+id, updateResourceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.resourcesService.remove(+id);
  // }
}
