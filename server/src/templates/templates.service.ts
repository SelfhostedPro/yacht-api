import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
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
  async addTemplate({ url, name, title }: addYachtTemplateDTO) {
    const template = await fetch(url).then((res) => res.json());
    const exists = fs.existsSync(this.templatePath + '/' + name || template.name)
    if (!exists) {
      this.logger.log('Adding template: ' + template.name);
      try {
        const templateType = template['type'] || getTemplateType(template)
        const templateFile: YachtTemplate = {
          name: name || template.name,
          title: title || template.title,
          url: url,
          created: new Date().toISOString(),
          type: templateType,
          image: template.image || null,
          authors: template.authors || null,
          featured: template.featured || null,
          description: template.description || null,
          links: template.links || null,
          templates: templateType === 'yachtv2' || templateType === 'portainerv2' ? template.templates : template // if template type is yachtv2 or portainerv2 the templates are nested in the template property.
        }
        fs.outputFileSync(`${this.templatePath}/${name || template.name}/template.json`, JSON.stringify(templateFile))
        this.logger.success(`Template ${name || template.name} added.`);
        return templateFile
      } catch (err) {
        throw new Error(err)
      }
    } else {
      throw new HttpException(`Template "${name}" already exists`, HttpStatus.CONFLICT)
    }
  }
  async deleteTemplate(name: string) {
    const exists = fs.existsSync(this.templatePath + '/' + name)
    if (exists) {
      this.logger.log('Deleting template: ' + name);
      try {
        fs.removeSync(`${this.templatePath}/${name}`)
        this.logger.success(`Template ${name} deleted.`);
        return true
      } catch (err) {
        throw new Error(err)
      }
    } else {
      throw new HttpException(`Template "${name}" does not exist`, HttpStatus.NOT_FOUND)
    }
  }
}
