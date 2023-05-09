/// <reference types="node" />
export interface YachtConfig {
    base: {
        name: string;
        servers: serverConfig[];
        auth: boolean;
        theme: 'dark' | 'light';
        sessionTimeout: number;
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
export interface serverConfig {
    name: string;
    options: DockerOptions;
}
export interface DockerOptions {
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
interface KeyObject {
    pem: string | Buffer;
    passphrase?: string | undefined;
}
export {};
