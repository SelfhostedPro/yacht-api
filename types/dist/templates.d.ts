export interface YachtTeamplate {
    name: string;
    url: string;
    description?: string;
    template: PortainerV1Template | PortainerV2Template | YachtV1Template | YachtV2Template;
}
export interface PortainerV1Template {
    type: number;
    title: string;
    description?: string;
    logo?: string;
    note?: string;
    image: string;
    command?: string;
    network?: string;
    repository?: Stack;
    categories?: string[];
    platform?: 'linux' | 'windows';
    restart_policy?: string;
    ports?: string[];
    volumes?: Volume[];
    environment?: Environment[];
    labels?: Labels[];
    privileged?: boolean;
    interactive?: boolean;
    hostname?: string;
}
export interface PortainerV2Template {
    version: '2';
    templates: PortainerV1Template[];
}
export interface Stack {
    url: string;
    stackfile: string;
}
export interface Environment {
    name: string;
    label: string;
    default?: string;
    set?: string;
}
export interface Volume {
    container: string;
    bind: string;
    readonly?: boolean;
}
export interface Labels {
    name: string;
    value: string;
}
export interface YachtV1Template {
}
export interface YachtV2Template {
}
