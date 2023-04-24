import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { HttpService } from '@nestjs/axios';
import { TemplateUrlDTO } from './classes';


@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
    constructor(
        private readonly templatesService: TemplatesService,
        private readonly httpService: HttpService
    ) {}

    @Get('/')
    async getTemplates(){
        return await this.templatesService.getTemplates()
    }

    @Post('/')
    async addTemplate(@Body() body: TemplateUrlDTO){
        return await this.addTemplate(body)
    }
}
