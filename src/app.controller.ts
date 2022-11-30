import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Used for testing out SSE
  // @Get()
  // index(@Res() response: Response) {
  //   response
  //     .type('text/html')
  //     .send(readFileSync(join(__dirname, 'index.html')).toString());
  // }

  @Get('health')
  @HttpCode(200)
  healthcheck(): string {
    return this.appService.healthcheck();
  }
}
