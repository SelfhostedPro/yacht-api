export class updateSettingsDto {
  base: baseDto;
}

export class baseDto {
  name: string;
  servers: serverSettingsDto[];
  auth: boolean;
  theme: 'light' | 'dark';
  sessionTimeout: number;
}
export class serverSettingsDto {
  name: string;
  options: DockerOptions;
}
export class serverConfig {
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
