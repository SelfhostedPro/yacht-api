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
export interface ContainerFormPorts {
    label?: string;
    host?: string;
    container?: string;
    protocol?: 'tcp' | 'udp';
}
export interface ContainerFormVolumes {
    label?: string;
    source?: string;
    destination?: string;
    read_only?: boolean;
}
export interface CreateContainerForm {
    name?: string;
    image: string;
    restart?: string;
    network?: string;
    network_mode?: string;
    mounts?: ContainerMount[];
    ports?: ContainerFormPorts[];
    env?: string[];
    labels?: {
        [label: string]: string;
    };
    command?: string[];
    devices?: string[];
    sysctls?: string[];
    cap_add?: CapOption[];
    cap_drop?: CapOption[];
    cpus?: number;
    mem_limit?: number;
}
export interface NetworkModes {
    network_modes: "bridge" | "host" | "none";
}
export interface CapOption {
    option: "SYS_MODULE" | "SYS_RAWIO" | "SYS_PACCT" | "SYS_ADMIN" | "SYS_NICE" | "SYS_RESOURCE" | "SYS_TIME" | "SYS_TTY_CONFIG" | "AUDIT_CONTROL" | "MAC_ADMIN" | "MAC_OVERRIDE" | "NET_ADMIN" | "SYSLOG" | "DAC_READ_SEARCH" | "LINUX_IMMUTABLE" | "NET_BROADCAST" | "IPC_LOCK" | "IPC_OWNER" | "SYS_PTRACE" | "SYS_BOOT" | "LEASE" | "WAKE_ALARM" | "BLOCK_SUSPEND";
}
