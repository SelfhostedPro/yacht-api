import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { HttpService } from '@nestjs/axios';
import { TemplateUrlDTO } from './classes';
import { map, catchError, reduce, lastValueFrom } from 'rxjs';


@ApiTags('templates')
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
        const request = this.httpService.get(body.url)
        .pipe(
            map((res) => res.data),
            map((data) => {
                return data
            })
        )
        const apps = await lastValueFrom(request)
        console.log(apps)
        return 'ok'
    }
}
