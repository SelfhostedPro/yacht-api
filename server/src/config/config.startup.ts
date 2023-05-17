import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import { YachtConfig } from '@yacht/types';
import { Logger } from '../common/logger/logger.service';
//
/**
 * Return config required to start the console server
 */
export function getStartupConfig(): YachtConfig {
  const logger = new Logger()
  logger.setContext('StartupConfig')
  logger.log('Getting startup config...');
  const configPath = path.resolve('../config/config.yaml');
  const defaultConfig: YachtConfig = {
    base: {
      name: 'Yacht',
      servers: [
        {
          name: 'local',
          options: {
            socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock',
          },
        },
      ],
      auth: true,
      theme: 'dark',
      sessionTimeout: 3600,
    },
  };
  let config;
  if (fs.existsSync(configPath)) {
    try {
      config = yaml.load(fs.readFileSync(configPath, 'utf8'));
      logger.log('Config Exists!');
    } catch (e) {
      logger.error(e);
    }
  } else {
    try {
      fs.mkdirSync(path.resolve('../config/storage/templates'), {
        recursive: true,
      });
      fs.mkdirSync(path.resolve('../config/storage/.ssh'), { recursive: true });
      fs.writeFileSync(configPath, yaml.dump(defaultConfig), { flag: 'w' });
      logger.success('Config Created!');
    } catch (e) {
      logger.error(e);
    }
  }

  return config;
}
