import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @HttpCode(200)
  healthcheck(): string {
    return this.appService.healthcheck();
  }
}
