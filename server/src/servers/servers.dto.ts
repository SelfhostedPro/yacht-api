import { KeyObject } from "docker-modem";

export class NewServer {
    name: string
    options: NewServerOptions
}

export class NewServerOptions {
    socketPath?: string | undefined;
    host?: string | undefined;
    port?: number | string | undefined;
    username?: string | undefined;
    password?: string;
    headers?: { [name: string]: string };
    ca?: string | string[] | Buffer | Buffer[] | undefined;
    cert?: string | string[] | Buffer | Buffer[] | undefined;
    key?: string | string[] | Buffer | Buffer[] | KeyObject[] | undefined;
    protocol?: 'https' | 'http' | 'ssh' | undefined;
    timeout?: number | undefined;
    version?: string | undefined;
    sshAuthAgent?: string | undefined;
    Promise?: typeof Promise | undefined;
}