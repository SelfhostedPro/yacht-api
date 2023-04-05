import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';

import { Logger } from '../logger/logger.service';
import { YachtConfig } from './config.service';

/**
 * Return config required to start the console server
 */
export async function getStartupConfig() {
  const logger = new Logger();

  const configPath = path.resolve(os.homedir(), '.yacht/config.yaml');
  const defaultConfig: YachtConfig = {
    base: {
      name: 'Yacht',
      servers: [
        {type: "local", path: '/var/run/docker.sock'}
      ],
      auth: true,
      theme: 'dark',
      sessionTimeout: 8
    },
  };
  let config;
  try {
    config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    logger.log('Config Exists!');
  } catch (e) {
    if (e.code == 'ENOENT') {
      fs.mkdirSync(path.resolve(os.homedir(), '.yacht/'));
      fs.writeFileSync(configPath, yaml.dump(defaultConfig), { flag: 'w' });
      logger.log('Config Created!');
    } else {
      logger.error(e);
    }
  }

  return config;
}
