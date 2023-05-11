import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';
import { TemplateUrlDTO } from './classes';
import * as fs from 'fs-extra';
import { map, catchError, reduce, lastValueFrom } from 'rxjs';
// import { HttpService } from '@nestjs/axios';

@Injectable()
export class TemplatesService {
  constructor(
    // private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}
  async getTemplates() {
    const templateList = [];
    this.configService.storagePath;
    fs.readdir(this.configService.storagePath, (err, files) => {
      files.forEach((file) => {
        templateList.push(file);
      });
    });
    return templateList;
  }
  //     async addTemplate(body: TemplateUrlDTO) {
  //         // const request = this.httpService.get(body.url)
  //         // .pipe(
  //             // map((res) => res.data),
  //             // map((data) => {
  //                 return data
  //             })
  //         )
  //         const apps = await lastValueFrom(request)
  //         console.log(apps)
  //     }
}
