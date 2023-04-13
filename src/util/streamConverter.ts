import { ContainerStats } from 'dockerode'
import { Transform } from "stream"

export interface BasicStats {
    Name: string,
    MemoryPercentage: string,
    CpuUsage: string
}

export const transformStatStream = new Transform({ objectMode: true , transform (chunk, enc, callback) {
    const stats = JSON.parse(chunk.toString())
    formatCpuPercent(stats)
    formatMemPercent(stats)
    const formattedStats: BasicStats = {
        Name: '',
        MemoryPercentage: '',
        CpuUsage: ''
    }
    formattedStats.MemoryPercentage = formatMemPercent(stats).toFixed(2)
    formattedStats.CpuUsage = formatCpuPercent(stats).toFixed(2)
    formattedStats.Name = stats.name.slice(1)
    this.push(JSON.stringify(formattedStats))
    callback()
}})


export function formatCpuPercent(data: ContainerStats) {
    const cpuDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage
    const systemCpuDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage
    return (cpuDelta / systemCpuDelta) * data.cpu_stats.online_cpus * 100.0
}

export function formatMemPercent(data: ContainerStats) {
    let usedMemory = 0
    if (data.memory_stats.hasOwnProperty("stats") && data.memory_stats.stats.cache) {
        usedMemory = data.memory_stats.usage - data.memory_stats.stats.cache
    } else {
        usedMemory = data.memory_stats.usage
    }
    return (usedMemory / data.memory_stats.limit) * 100.0
}