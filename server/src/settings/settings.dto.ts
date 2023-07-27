export class updateSettingsDto {
  base: baseDto;
}
export class baseDto {
  name: string;
  servers: serverConfigDto[];
  auth: boolean;
  theme: ThemeSettings;
  plugins: string[];
  sessionTimeout: number;
}
export class ThemeSettings {
  type: 'light' | 'dark' | 'custom';
  primary?: string;
  secondary?: string;
  surface?: string;
  foreground?: string;
  background?: string;
  error?: string;
  info?: string;
  warning?: string;
  success?: string;
}

export class serverUIConfigDto {
  theme: ThemeSettings;
  auth: boolean;
  plugins: string[];
}

export class serverConfigDto {
  name: string;
  options: DockerOptions;
}

class DockerOptions {
  socketPath?: string | undefined;
  host?: string | undefined;
  port?: number | string | undefined;
  username?: string | undefined;
  headers?: {
    [name: string]: string;
  };
  ca?: string | string[] | Buffer | Buffer[] | undefined;
  cert?: string | string[] | Buffer | Buffer[] | undefined;
  key?: string | string[] | Buffer | Buffer[] | KeyObject[] | undefined;
  protocol?: 'https' | 'http' | 'ssh' | undefined;
  timeout?: number | undefined;
  version?: string | undefined;
  sshAuthAgent?: string | undefined;
  Promise?: typeof Promise | undefined;
}
class KeyObject {
  pem: string | Buffer;
  passphrase?: string | undefined;
}
