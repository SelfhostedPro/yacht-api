import { PortainerV1Template, PortainerV2Template } from "./portainer";
import { CapAdd, CapDrop, KeyValue } from "../apps/create";
export interface YachtTemplate {
    name: string;
    url: string;
    title?: string;
    description?: string;
    image?: string;
    created?: string;
    type?: 'portainerv1' | 'portainerv2' | 'yachtv1' | 'yachtv2';
    authors?: YachtTemplateAuthor[];
    links?: YachtTemplateLink[];
    featured?: number[];
    templates: PortainerV1Template[] | PortainerV2Template['templates'] | YachtV1Template[] | YachtV2Template[];
}
export interface YachtTemplateLink {
    url: string;
    text?: string;
    icon?: string;
    color?: string;
}
export interface YachtTemplateAuthor {
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
    access_control?: PortainerTemplateAccessControl;
    command?: string;
    network?: string;
    repository?: PortainerTemplateStack;
    categories?: string[];
    platform?: 'linux' | 'windows';
    restart_policy?: string;
    ports?: YachtV1TemplatePort | YachtV2TemplatePort | string[];
    volumes?: YachtTemplateVolume[];
    env?: YachtTemplateEnvironment[];
    labels?: KeyValue[];
    privileged?: boolean;
    interactive?: boolean;
    hostname?: string;
    cap_add?: CapAdd[];
    cap_drop?: CapDrop[];
    sysctls?: KeyValue[];
    devices?: string[];
    limits?: {
        cpus?: number;
        mem_limit?: number;
    };
}
export interface YachtV1TemplatePort {
    [key: string]: string;
}
export interface YachtV2TemplatePort {
    [key: string]: YachtV2TemplatePortValue;
}
export interface YachtV2TemplatePortValue {
    host?: string;
    container?: string;
    protocol?: 'tcp' | 'udp';
    description?: string;
    unchangable?: boolean | Array<'host' | 'container' | 'protocol'>;
}
export interface PortainerTemplateStack {
    url: string;
    stackfile: string;
}
export interface PortainerTemplateAccessControl {
    enabled: boolean;
}
export interface YachtTemplateEnvironment {
    name: string;
    label?: string;
    description?: string;
    default?: string;
    preset?: boolean;
    set?: string;
    value?: string;
}
export interface YachtTemplateVolume {
    container: string;
    bind?: string;
    readonly?: boolean;
    label?: string;
}
export interface YachtTemplateLabels {
    name: string;
    value: string;
}
export {};
