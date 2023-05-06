import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';

import { Logger } from '../logger/logger.service';
import { YachtConfig } from '@yacht/types';
//
/**
 * Return config required to start the console server
 */
export async function getStartupConfig() {
  const logger = new Logger();
  const configPath = path.resolve('../config/config.yaml');
  const defaultConfig: YachtConfig = {
    base: {
      name: 'Yacht',
      servers: [{
        name: 'local',
        options: {
          socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock'
        }
      }],
      auth: true,
      theme: 'dark',
      sessionTimeout: 3600
    },
  };
  let config;
  if (fs.existsSync(configPath)) {
    try {
      config = yaml.load(fs.readFileSync(configPath, 'utf8'));
      logger.log('Config Exists!');
    } catch (e) {
      logger.error(e)
    }
  } else {
    try {
      fs.mkdirSync(path.resolve('../config/storage/templates'), { recursive: true })
      fs.writeFileSync(configPath, yaml.dump(defaultConfig), { flag: 'w' });
      logger.log('Config Created!');
    } catch (e) {
      logger.log(e)
    }

  }

  return config;
}
