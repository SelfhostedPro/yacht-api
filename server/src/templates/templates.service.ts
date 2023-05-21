import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Logger } from '../common/logger/logger.service';
import * as fs from 'fs-extra';
import { addYachtTemplateDTO } from './dto/templates.dto';
import { YachtTemplate } from '@yacht/types';
import { getTemplateType } from '../util/templateFormatter';

@Injectable()
export class TemplatesService implements OnModuleInit {
  templatePath: string;
  onModuleInit() {
    fs.ensureDirSync(this.templatePath);
    this.logger.log('Template Storage initialized');
  }
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(TemplatesService.name);
    this.templatePath = this.configService.storagePath + '/templates';
  }
  // Get list of templates
  async getTemplates() {
    try {
      const templateList = fs.readdirSync(this.templatePath).map((template) => {
        const templateJson: YachtTemplate = fs.readJSONSync(`${this.templatePath}/${template}/template.json`, 'utf8')
        return templateJson
      })
      return templateList;
    } catch (err) {
      throw new Error(err)
    }
  }
  // Add a template
  async addTemplate(body: addYachtTemplateDTO) {
    const template = await fetch(body.url).then((res) => res.json());
    const exists = fs.existsSync(this.templatePath + '/' + body.name)
    if (!exists) {
      this.logger.log('Adding template: ' + body.name);
      try {
        const templateType = template['type'] || getTemplateType(template)
        const templateFile: YachtTemplate = {
          name: body.name,
          title: template.title ?? body.name,
          url: body.url,
          created: new Date().toISOString(),
          type: templateType,
          featured: template.featured || null,
          templates: templateType === 'yachtv2' || templateType === 'portainerv2' ? template.templates : template // if template type is yachtv2 or portainerv2 the templates are nested in the template property.
        }
        fs.outputFileSync(`${this.templatePath}/${body.name}/template.json`, JSON.stringify(templateFile))
        return templateFile
      } catch (err) {
        throw new Error(err)
      }
    } else {
      this.logger.error('Template already exists: ' + template.name)
      throw new Error('Template already exists: ' + template.name)
    }
  }
}
