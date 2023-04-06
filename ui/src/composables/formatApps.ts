import { format, parseISO } from 'date-fns'
import { ContainerInfo, ContainerStats } from 'dockerode'

export interface ReadableContainerInfo extends ContainerInfo {
    CreatedDate: string|number,
    ShortId: string,
    ShortName: string
}
export interface BasicStats {
    MemoryPercentage: number,
    CpuUsage: number
}

export function formatApps(data) {
    const appList: ReadableContainerInfo[] = []

    for (const app in data) {
        console.log(data[app])
        data[app]['CreatedDate'] = format(new Date(data[app]['Created'] * 1000), 'MM/dd/yyyy')
        data[app]['ShortId'] = data[app]['Id'].substring(0,10)
        data[app]['ShortName'] = data[app]['Names'][0].slice(1)
        appList.push(data[app])
    }
    return appList
}

export function formatInspect(data:ReadableContainerInfo) {

    data['CreatedDate'] = format(parseISO(data['Created'].toString()), 'MM/dd/yyyy')
    data['ShortId'] = data['Id'].substring(0,10)
    data['ShortName'] = data['Name'].slice(1)
    return {...data}
}

export function formatStats(data: ContainerStats) {
    const formattedStats: BasicStats = {
        MemoryPercentage: 0,
        CpuUsage: 0
    }
    formattedStats.MemoryPercentage = formatMemPercent(data)
    formattedStats.CpuUsage = formatCpuPercent(data)
    return formattedStats
}

export function formatCpuPercent(data: ContainerStats) {
    const cpuDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage
    const systemCpuDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage
    return (cpuDelta / systemCpuDelta) * data.cpu_stats.online_cpus * 100.0
}

export function formatMemPercent(data: ContainerStats) {
    let usedMemory = 0
    if (data.memory_stats.stats.cache) {
        usedMemory = data.memory_stats.usage - data.memory_stats.stats.cache
    } else {
        usedMemory = data.memory_stats.usage
    }
    return (usedMemory / data.memory_stats.limit) * 100.0
}