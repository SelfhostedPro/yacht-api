import { DockerOptions } from 'dockerode';
export interface YachtConfig {
    base: {
        name: string;
        servers: [
            {
                name: string;
                options: DockerOptions;
            }
        ];
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
