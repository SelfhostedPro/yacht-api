import { PortainerV1Template, PortainerV2Template } from "./portainer";
export interface YachtTemplate {
    name: string;
    url: string;
    title?: string;
    description?: string;
    image?: string;
    created?: string;
    type?: 'portainerv1' | 'portainerv2' | 'yachtv1' | 'yachtv2';
    authors?: Author[];
    contact?: string;
    featured?: number[];
    templates: PortainerV1Template[] | PortainerV2Template['templates'] | YachtV1Template[] | YachtV2Template[];
}
export interface Author {
    name: string;
    url?: string;
    avatar?: string;
}
export interface YachtV2Template extends YachtV1Template {
    featured_image?: string;
}
export interface YachtV1Template {
    type?: number;
    title: string;
    name?: string;
    description?: string;
    logo?: string;
    note?: string;
    image: string;
    registry?: string;
    administrator_only?: boolean;
    access_control?: AccessControl;
    command?: string;
    network?: string;
    repository?: Stack;
    categories?: string[];
    platform?: 'linux' | 'windows';
    restart_policy?: string;
    ports?: YachtPorts | string[];
    volumes?: Volume[];
    environment?: Environment[];
    labels?: Labels[];
    privileged?: boolean;
    interactive?: boolean;
    hostname?: string;
    cap_add?: string[];
    cap_drop?: string[];
    devices?: string[];
}
export interface YachtPorts {
    [key: string]: string;
}
export interface Stack {
    url: string;
    stackfile: string;
}
export interface AccessControl {
    enabled: boolean;
}
export interface Environment {
    name: string;
    label?: string;
    default?: string;
    set?: string;
}
export interface Volume {
    container: string;
    bind?: string;
    readonly?: boolean;
}
export interface Labels {
    name: string;
    value: string;
}
