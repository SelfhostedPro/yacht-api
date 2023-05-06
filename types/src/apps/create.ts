import { ContainerMount, ContainerOciInfo } from "./apps"

export interface KeyValue {
    key: string,
    value: string,
}

export interface ContainerFormEnvs {
    key?: string,
    value?: string
}

export interface ContainerFormPorts {
    label?: string,
    host?: string,
    container?: string,
    protocol?: 'tcp' | 'udp'
}

export interface ContainerFormVolumes {
    label?: string,
    source?: string,
    destination?: string,
    read_only?: boolean,
}

export interface CreateContainerForm {
    name?: string,
    image: string,
    info?: ContainerOciInfo,
    restart?: string,
    network?: string,
    network_mode?: string,
    mounts?: ContainerMount[],
    ports?: ContainerFormPorts[],
    env?: KeyValue[],
    labels?: KeyValue[],
    command?: string[],
    devices?: Devices[],
    sysctls?: KeyValue[],
    capabilities: {
        add?: CapAdd[],
        drop?: CapDrop[],
    },
    limits: {
        cpus?: number,
        mem_limit?: number
    }
}

export interface NetworkModes {
    network_modes: "bridge" | "host" | "none"
}

export interface Devices {
    host: string,
    container: string,
    permissions?: 'r' | 'w' | 'm' | 'mw' | 'rm' | 'rwm' | 'rw'
}

export interface CapDrop {
    option: "AUDIT_WRITE" | "CHOWN" | "DAC_OVERRIDE" | "FOWNER" | "FSETID" | "KILL" | "SETGID" | "SETUID" | "SETPCAP" | "NET_BIND_SERVICE" | "NET_RAW" | "SYS_CHROOT"
}

export interface CapAdd {
    option: "SYS_MODULE" | "SYS_RAWIO" | "SYS_PACCT" | "SYS_ADMIN" | "SYS_NICE" | "SYS_RESOURCE" | "SYS_TIME" | "SYS_TTY_CONFIG" | "AUDIT_CONTROL" | "MAC_ADMIN" | "MAC_OVERRIDE" | "NET_ADMIN" | "SYSLOG" | "DAC_READ_SEARCH" | "LINUX_IMMUTABLE" | "NET_BROADCAST" | "IPC_LOCK" | "IPC_OWNER" | "SYS_PTRACE" | "SYS_BOOT" | "LEASE" | "WAKE_ALARM" | "BLOCK_SUSPEND",
}
