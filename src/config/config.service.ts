import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as crypto from 'crypto';
import * as _ from 'lodash';

export interface YachtConfig {
  base: {
    name: string;
    servers: [{
      type: string, path: string
    }];
    auth: boolean,
    theme: 'dark' | 'light',
    sessionTimeout: number,
    templates?: {
      url: string;
      name: string;
      apps?: Object[];
    };
    template_variables?: {
      variable: string;
      replacement: string;
    };
  };
}

@Injectable()
export class ConfigService {
  public name = 'yacht';

  // yacht env
  public configPath =
    process.env.UIX_CONFIG_PATH ||
    path.resolve(os.homedir(), '.yacht/config.yaml');
  public storagePath =
    process.env.UIX_STORAGE_PATH || path.resolve(os.homedir(), '.yacht');
  public customPluginPath = process.env.UIX_CUSTOM_PLUGIN_PATH;
  public strictPluginResolution =
    process.env.UIX_STRICT_PLUGIN_RESOLUTION === '1';
  public secretPath = path.resolve(this.storagePath, '.uix-secrets');
  public authPath = path.resolve(this.storagePath, 'auth.json');
  public accessoryLayoutPath = path.resolve(
    this.storagePath,
    'accessories',
    'uiAccessoriesLayout.json',
  );
  public configBackupPath = path.resolve(
    this.storagePath,
    'backups/config-backups',
  );
  public instanceBackupPath = path.resolve(
    this.storagePath,
    'backups/instance-backups',
  );
  public yachtInsecureMode = Boolean(process.env.UIX_INSECURE_MODE === '1');
  public yachtNoTimestamps = Boolean(process.env.UIX_LOG_NO_TIMESTAMPS === '1');
  public yachtVersion: string;

  // server env
  public minimumNodeVersion = '14.15.0';
  public serviceMode = process.env.UIX_SERVICE_MODE === '1';
  public runningInDocker = Boolean(process.env.yacht_CONFIG_UI === '1');

  // first user setup wizard
  public setupWizardComplete = true;

  public yachtConfig: YachtConfig;

  public ui: {
    name: string;
    port: number;
    host?: '::' | '0.0.0.0' | string;
    auth: 'form' | 'none';
    theme: string;
    lang?: string;
    log?: {
      method: 'file' | 'custom' | 'systemd' | 'native';
      command?: string;
      path?: string;
      service?: string;
    };
    sessionTimeout: number;
    loginWallpaper?: string;
    standalone?: boolean;
    debug?: boolean;
  };

  private baseFreeze: this['yachtConfig']['base'];
  private uiFreeze: this['ui'];

  public secrets: {
    secretKey: string;
  };

  public instanceId: string;

  constructor() {
    const yachtConfig: YachtConfig = <YachtConfig>(
      yaml.load(fs.readFileSync(this.configPath).toString())
    );
    this.parseConfig(yachtConfig);
  }

  /**
   * Loads the config from the config.json
   */
  public parseConfig(yachtConfig: YachtConfig) {
    this.yachtConfig = yachtConfig;

    if (!this.yachtConfig.base) {
      this.yachtConfig.base = {} as this['yachtConfig']['base'];
    }

    // this.ui = Array.isArray(this.yachtConfig.platforms) ? this.yachtConfig.platforms.find(x => x.platform === 'config') : undefined as any;

    if (!this.ui) {
      this.ui = {
        name: 'Config',
      } as any;
    }

    process.env.UIX_PLUGIN_NAME = this.ui.name || 'yacht-config-ui-x';

    if (this.runningInDocker) {
      this.setConfigForDocker();
    }

    if (!this.ui.port) {
      this.ui.port = 8080;
    }

    if (!this.ui.sessionTimeout) {
      this.ui.sessionTimeout = this.ui.auth === 'none' ? 1296000 : 28800;
    }

    this.secrets = this.getSecrets();
    this.instanceId = this.getInstanceId();

    this.freezeUiSettings();
  }

  /**
   * Settings that are sent to the UI
   */
  public uiSettings() {
    return {
      env: {
        enableAccessories: this.yachtInsecureMode,
        // enableTerminalAccess: this.enableTerminalAccess,
        yachtVersion: this.yachtVersion || null,
        yachtInstanceName: this.yachtConfig.base.name,
        nodeVersion: process.version,
        platform: os.platform(),
        runningInDocker: this.runningInDocker,
        serviceMode: this.serviceMode,
        lang: this.ui.lang === 'auto' ? null : this.ui.lang,
        instanceId: this.instanceId,
        setupWizardComplete: this.setupWizardComplete,
      },
      formAuth: Boolean(this.ui.auth !== 'none'),
      theme: this.ui.theme || 'auto',
      serverTimestamp: new Date().toISOString(),
    };
  }

  /**
   * Freeze a copy of the initial ui config and yacht port
   */
  private freezeUiSettings() {
    if (!this.uiFreeze) {
      // freeze ui
      this.uiFreeze = {} as this['ui'];
      Object.assign(this.uiFreeze, this.ui);
    }

    if (!this.baseFreeze) {
      // freeze bridge port
      this.baseFreeze = {} as this['yachtConfig']['base'];
      Object.assign(this.baseFreeze, this.yachtConfig.base);
    }
  }

  /**
   * Populate the required config for oznu/yacht docker
   */
  private setConfigForDocker() {
    // forced config
    this.yachtInsecureMode = Boolean(process.env.yacht_INSECURE === '1');
    this.ui.log = {
      method: 'file',
      path: '/yacht/logs/yacht.log',
    };

    // these options can be overridden using the config.json file
    if (!this.ui.port && process.env.yacht_CONFIG_UI_PORT) {
      this.ui.port = parseInt(process.env.yacht_CONFIG_UI_PORT, 10);
    }
    this.ui.theme =
      this.ui.theme || process.env.yacht_CONFIG_UI_THEME || 'auto';
    this.ui.auth =
      this.ui.auth ||
      (process.env.yacht_CONFIG_UI_AUTH as 'form' | 'none') ||
      'form';
    this.ui.loginWallpaper =
      this.ui.loginWallpaper ||
      process.env.yacht_CONFIG_UI_LOGIN_WALLPAPER ||
      undefined;
  }

  /**
   * Gets the unique secrets for signing JWTs
   */
  private getSecrets() {
    if (fs.pathExistsSync(this.secretPath)) {
      try {
        const secrets = fs.readJsonSync(this.secretPath);
        if (!secrets.secretKey) {
          return this.generateSecretToken();
        } else {
          return secrets;
        }
      } catch (e) {
        return this.generateSecretToken();
      }
    } else {
      return this.generateSecretToken();
    }
  }

  /**
   * Generates the secret token for signing JWTs
   */
  private generateSecretToken() {
    const secrets = {
      secretKey: crypto.randomBytes(32).toString('hex'),
    };

    fs.writeJsonSync(this.secretPath, secrets);

    return secrets;
  }

  /**
   * Generates a public instance id from a sha256 has of the secret key
   */
  private getInstanceId(): string {
    return crypto
      .createHash('sha256')
      .update(this.secrets.secretKey)
      .digest('hex');
  }
}
