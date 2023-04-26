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

export interface OciInfo {
    title?: string,
    description?: string,
    docs?: string,
    url?: string,
    source?: string,
    vendor?: string
}