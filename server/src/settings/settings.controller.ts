import {
  Body,
  Controller,
  Get,
  HttpException,
  SetMetadata,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { YachtConfig } from '@yacht/types';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ConfigService } from 'src/config/config.service';
import { serverUIConfigDto, updateSettingsDto } from './settings.dto';
import { SSHManagerService } from 'src/util/sshManager.service';
import { Public } from 'src/common/decorators/public';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly keyManager: SSHManagerService,
  ) {}

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
      return this.keyManager.getAllKeys();
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        console.log(err);
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  @Public()
  @Get('/ui')
  @ApiCreatedResponse({
    description: 'List all ui settings',
  })
  async getUiSettings(): Promise<serverUIConfigDto> {
    try {
      return {
        plugins: this.configService.yachtConfig.base.plugins || null,
        auth: this.configService.yachtConfig.base.auth || true,
        theme: this.configService.yachtConfig.base.theme,
      } as serverUIConfigDto;
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
