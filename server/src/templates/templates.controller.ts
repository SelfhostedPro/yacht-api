import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { addYachtTemplateDTO } from './dto/templates.dto';

@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
  ) {}

  @Get('/')
  async getTemplates() {
    return await this.templatesService.getTemplates();
  }

  @Post('/')
  async addTemplate(@Body() body: addYachtTemplateDTO) {
    return await this.templatesService.addTemplate(body);
  }
}
