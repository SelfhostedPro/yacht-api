import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { YachtConfig } from '@yacht/types';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { ConfigService } from '../config/config.service';
import { updateSettingsDto } from './settings.dto';
import { SSHKeyManager } from 'src/util/sshKeyManager';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiCreatedResponse({
    description: 'List all settings',
  })
  async getSettings(): Promise<YachtConfig> {
    try {
      return this.configService.yachtConfig;
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Get('/keys')
  @ApiCreatedResponse({
    description: 'List all ssh keys',
  })
  async getKeys(): Promise<string[]> {
    try {
      return new SSHKeyManager().getAllKeys();
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        console.log(err)
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }

  @Post()
  async writeSettings(
    @Body() YachtConfig: updateSettingsDto,
  ): Promise<YachtConfig> {
    try {
      const test = YachtConfig;
      const writeConfig = this.configService.writeConfig(YachtConfig);
      return this.configService.yachtConfig;
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
