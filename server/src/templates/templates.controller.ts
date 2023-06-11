import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
  @Delete('/:name')
  async deleteTemplate(
    @Param('name') name: string,
  ) {
    return await this.templatesService.deleteTemplate(name);
  }
}
