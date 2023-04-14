import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';
import * as fs from 'fs-extra';


@Injectable()
export class TemplatesService {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) { }
    async getTemplates() {
        const templateList = []
        this.configService.storagePath
        fs.readdir(this.configService.storagePath, (err, files) => {
            files.forEach(file => {
                templateList.push(file)
            });
        });
        return templateList
    }
}
