import { ContainerInfo, ContainerInspectInfo } from "dockerode"

export interface ReadableContainerInfo extends ContainerInfo {
    CreatedDate: string|number,
    ShortId: string,
    ShortName: string
}

export interface ReadableContainerDetails extends ContainerInspectInfo {
    CreatedDate: string|number,
    ShortId: string,
    ShortName: string
}

export interface ReadableContainerStats {
    [key: string]: {
        Name: string,
        MemoryPercentage: string,
        CpuUsage: string
    }

}

export interface Container {
    name: string,
    id: string,
    created: Date,
    status: string,
    restart: {
        policy: string,
        count: number
    }
    config: {
        network: ContainerNetworkSettings,
        general: ContainerGeneralConfig
    },
    mounts?: ContainerMount[],
    ports?: ContainerPorts[],
    env?: string[],
    labels?: {
        [key: string]: string
    }

}

export interface ContainerGeneralConfig {
    hostname: string,
    tty: boolean,
    user: string,
    appArmorProfile: string,
    platform: string,
    driver: string,
    path: string,
    args: string[],
    autoRemove: boolean,
    sysctls: {
        [key: string]: string|boolean
    }
    logConfig: {
        type: string,
        config: any,
    }
}

export interface ContainerMount {
    type: string
    name?: string
    source: string
    destination: string
    driver?: string
    mode: string
    rw: boolean
    propagation: string
}

export interface ContainerPorts {
    containerPort: string,
    hostPort: string,
    hostIP: string
}

export interface ContainerNetworkSettings {
    mode: string,
    macAddress: string,
    hairpinmode: boolean,
    networks: {
        [key: string]: {
            networkId: string,
            gateway: string,
            ipAddress: string,
            ipamconfig?: IPAMConfig,
        }
    }
}

export interface IPAMConfig {
    ipv4Address?: string,
    ipv6Address?: string,
    linkLocalIps?: string[]
}

export interface ContainerOciInfo {
    title?: string,
    description?: string,
    docs?: string,
    url?: string,
    source?: string,
    vendor?: string
}