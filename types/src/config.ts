export interface YachtConfig {
    base: {
        name: string;
        servers: serverConfig[]
        auth: boolean;
        theme: 'dark' | 'light' | ThemeSettings;
        plugins: string[]
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
    key?: string;
}
export interface ThemeSettings {
    primary: string;
    secondary: string;
    surface: string;
    foreground: string;
    background: string;
    error: string;
    info: string;
    warning: string;
    success: string;
}

export interface DockerOptions {
    socketPath?: string | undefined;
    host?: string | undefined;
    port?: number | string | undefined;
    username?: string | undefined;
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

interface KeyObject {
    pem: string | Buffer;
    passphrase?: string | undefined;
}