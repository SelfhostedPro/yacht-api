import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Logger } from '../common/logger/logger.service';
import * as fs from 'fs-extra';
import { parse } from 'yaml';
import { addYachtTemplateDTO } from './dto/templates.dto';
import { PortainerV1Template, PortainerV2Template, YachtTemplate, YachtV1Template, YachtV2Template } from '@yacht/types';
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
      const templateList = fs.readdirSync(this.templatePath)
      .filter((template) => template !== 'tmp')
      .map((template) => {
        const templateJson: YachtTemplate = fs.readJSONSync(`${this.templatePath}/${template}/template.json`, 'utf8')
        return templateJson
      })
      return templateList;
    } catch (err) {
      throw new Error(err)
    }
  }
  // Add a template
  async addTemplate({ url, name, title }: addYachtTemplateDTO): Promise<YachtTemplate> {
    const rawTemplate = await fetch(url).then((res) => res.text());
    let template: PortainerV1Template | YachtV1Template | YachtV2Template | PortainerV2Template;
    try {
      template = parse(rawTemplate) || JSON.parse(rawTemplate);
    } catch (e) {
      throw new HttpException(`Template "${name}" is not a valid JSON or YAML file`, HttpStatus.BAD_REQUEST);
    }
    const exists = await fs.pathExists(`${this.templatePath}/${name || template['name']}`);
    if (!exists) {
      this.logger.log('Adding template: ' + name || template['name']);
      try {
        const templateType = template['type'] || getTemplateType(template);
        const templateFile: YachtTemplate = {
          name: name || template['name'],
          title: title || template['title'],
          url: url,
          created: new Date().toISOString(),
          type: templateType,
          image: template['image'] || null,
          authors: template['authors'] || null,
          featured: template['featured'] || null,
          description: template['description'] || null,
          links: template['links'] || null,
          templates: templateType === 'yachtv2' || templateType === 'portainerv2' ? template['templates'] : template // if template type is yachtv2 or portainerv2 the templates are nested in the template property.
        };
        await fs.outputFile(`${this.templatePath}/${name || template['name']}/template.json`, JSON.stringify(templateFile));
        this.logger.success(`Template ${name || template['name']} added.`);
        return templateFile;
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new HttpException(`Template "${name}" already exists`, HttpStatus.CONFLICT);
    }
  }

  async deleteTemplate(name: string): Promise<boolean> {
    const exists = await fs.pathExists(`${this.templatePath}/${name}`);
    if (exists) {
      this.logger.log('Deleting template: ' + name);
      try {
        await fs.remove(`${this.templatePath}/${name}`);
        this.logger.success(`Template ${name} deleted.`);
        return true;
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new HttpException(`Template "${name}" does not exist`, HttpStatus.NOT_FOUND);
    }
  }

  async updateTemplate(name: string): Promise<YachtTemplate> {
    const exists = await fs.exists(`${this.templatePath}/${name}`);
    if (exists) {
      this.logger.log('Updating template: ' + name);
      try {
        const existingTemplate: YachtTemplate = await fs.readJSON(`${this.templatePath}/${name}/template.json`, 'utf8');
        const rawTemplate = await fetch(existingTemplate.url).then((res) => res.text());
        let template: PortainerV1Template | YachtV1Template | YachtV2Template | PortainerV2Template;
        try {
          template = parse(rawTemplate) || JSON.parse(rawTemplate);
        } catch (e) {
          throw new HttpException(`Template "${name}" is not a valid JSON or YAML file`, HttpStatus.BAD_REQUEST);
        }
        const templateType = template['type'] || getTemplateType(template);
        const templateFile: YachtTemplate = {
          name: existingTemplate.name,
          title: existingTemplate.title,
          url: existingTemplate.url,
          created: existingTemplate.created,
          updated: new Date().toISOString(),
          type: templateType,
          image: template['image'] || null,
          authors: template['authors'] || null,
          featured: template['featured'] || null,
          description: template['description'] || null,
          links: template['links'] || null,
          templates: templateType === 'yachtv2' || templateType === 'portainerv2' ? template['templates'] : template // if template type is yachtv2 or portainerv2 the templates are nested in the template property.
        };
        // Write to temp file in case there's storage issues so no data is lost.
        await fs.outputFile(`${this.templatePath}/tmp/${existingTemplate.name}/template.json`, JSON.stringify(templateFile));
        await fs.move(`${this.templatePath}/tmp/${existingTemplate.name}/template.json`, `${this.templatePath}/${existingTemplate.name}/template.json`, { overwrite: true });
        this.logger.success(`Template ${name} updated.`);
        return templateFile;
      } catch (error) {
        throw new HttpException(`Template "${name}" could not be updated, ${error}`, HttpStatus.INTERNAL_SERVER_ERROR)

      }
    } else {
      throw new HttpException(`Template "${name}" does not exist`, HttpStatus.NOT_FOUND)
    }
  }
}
