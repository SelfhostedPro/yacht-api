import { ContainerInfo, ContainerInspectInfo, NetworkInfo } from "dockerode";
export interface ReadableContainerInfo extends ContainerInfo {
    CreatedDate: string | number;
    ShortId: string;
    ShortName: string;
}
export interface ReadableContainerDetails extends ContainerInspectInfo {
    CreatedDate: string | number;
    ShortId: string;
    ShortName: string;
}
export interface YachtContainerStats {
    [key: string]: YachtContainerStat;
}
export interface YachtContainerStat {
    Name: string;
    MemoryPercentage: string;
    CpuUsage: string;
}
export interface Container {
    name: string;
    id: string;
    image: string;
    shortId: string;
    created: string;
    status: string;
    state?: string;
    info?: ContainerOciInfo;
    restart?: {
        policy: string;
        count: number;
    };
    config: {
        network: ContainerNetworkSettings;
        general?: ContainerGeneralConfig;
    };
    mounts?: ContainerMount[];
    ports?: ContainerPort[];
    env?: string[];
    labels?: {
        [label: string]: string;
    };
}
export interface ContainerGeneralConfig {
    hostname: string;
    tty: boolean;
    user: string;
    appArmorProfile: string;
    platform: string;
    driver: string;
    path: string;
    args: string[];
    autoRemove: boolean;
    capabilities?: {
        add: string[];
        remove: string[];
    };
    logConfig: {
        type: string;
        config: any;
    };
}
export interface ContainerMount {
    type: string;
    name?: string;
    source: string;
    destination: string;
    driver?: string;
    mode: string;
    rw: boolean;
    propagation: string;
}
export interface ContainerPort {
    containerPort: number;
    hostPort?: number;
    hostIP?: string;
    type?: string;
}
export interface ContainerNetworkSettings {
    mode: string;
    macAddress?: string;
    hairpinmode?: boolean;
    networks: {
        [networkType: string]: NetworkInfo;
    };
}
export interface IPAMConfig {
    ipv4Address?: string;
    ipv6Address?: string;
    linkLocalIps?: string[];
}
export interface ContainerOciInfo {
    title?: string;
    description?: string;
    docs?: string;
    url?: string;
    source?: string;
    vendor?: string;
    icon?: string;
}
