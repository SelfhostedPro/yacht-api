import { format, parseISO } from 'date-fns'
import { ContainerInfo, ContainerInspectInfo, Port } from 'dockerode'
import { Container, ContainerMount, ContainerPort } from 'ui/src/types/apps'

export interface ReadableContainerInfo extends ContainerInfo {
    CreatedDate?: string|number,
    ShortId?: string,
    ShortName?: string,
    PortDetails?: string
}

export interface FixedContainerInspectInfo extends ContainerInspectInfo {
    Mounts: Array<{
        Name?: string | undefined;
        Type: string;
        Source: string;
        Destination: string;
        Driver?: string | undefined;
        Mode: string;
        RW: boolean;
        Propagation: string;
    }>;
}

function isContainerInfo(obj: any): obj is ContainerInfo {
    return typeof obj.State === "string"
}
function isContainerInspectInfo(obj: any): obj is FixedContainerInspectInfo {
    return obj.State instanceof Object
}

export async function normalizeContainer(data: FixedContainerInspectInfo): Promise<Container>
export async function normalizeContainer(data: ContainerInfo): Promise<Container>
export async function normalizeContainer(data: ContainerInfo | FixedContainerInspectInfo): Promise<Container> {
    if (isContainerInfo(data)) {
        const container: Container = {
            name: data.Names[0].slice(1),
            id: data.Id,
            shortId: data['Id'].substring(0,10),
            image: data['Image'],
            created: format(new Date(data.Created * 1000), 'MM/dd/yyyy'),
            status: data.Status,
            info: {
                title: data.Labels["org.opencontainers.image.title"],
                description: data.Labels["org.opencontainers.image.description"],
                docs: data.Labels["org.opencontainers.image.docs"],
                url: data.Labels["org.opencontainers.image.url"],
                source: data.Labels["org.opencontainers.image.source"],
                vendor: data.Labels["org.opencontainers.image.vendor"],
                icon: await getIconUrl(data.Labels)
            },
            config: {
                network: {
                    mode: data.HostConfig.NetworkMode,
                    networks: data.NetworkSettings.Networks
                }
            },
            mounts: data.Mounts ? formatMounts(data.Mounts) : null,
            ports: data.Ports ? formatInfoPorts(data.Ports) : null,
            labels: data.Labels
        }
        return container
    } else if (isContainerInspectInfo(data)) {
        const container: Container = {
            name: data.Name.slice(1),
            id: data.Id,
            shortId: data['Id'].substring(0,10),
            image: data['Image'],
            created: format(parseISO(data['Created'].toString()), 'MM/dd/yyyy'),
            status: data.State.Status,
            restart: {
                policy: data.HostConfig.RestartPolicy.Name,
                count: data.RestartCount
            },
            info: {
                title: data.Config.Labels["org.opencontainers.image.title"],
                description: data.Config.Labels["org.opencontainers.image.description"],
                docs: data.Config.Labels["org.opencontainers.image.docs"],
                url: data.Config.Labels["org.opencontainers.image.url"],
                source: data.Config.Labels["org.opencontainers.image.source"],
                vendor: data.Config.Labels["org.opencontainers.image.vendor"],
                icon: await getIconUrl(data.Config.Labels)
            },
            config: {
                network: {
                    mode: data.HostConfig.NetworkMode,
                    networks: data.NetworkSettings.Networks
                },
                general: {
                    hostname: data.Config.Hostname,
                    tty: data.Config.Tty,
                    user: data.Config.User,
                    appArmorProfile: data.AppArmorProfile,
                    driver: data.Driver,
                    platform: data.Platform,
                    path: data.Path,
                    autoRemove: data.HostConfig.AutoRemove,
                    logConfig: {
                        type: data.HostConfig.LogConfig.Type,
                        config: data.HostConfig.LogConfig.Config
                    },
                    args: data.Args,
                }
            },
            mounts: data.Mounts ? formatMounts(data.Mounts) : null,
            ports: data.NetworkSettings.Ports ? formatInspectPorts(data.NetworkSettings.Ports) : null,
            labels: data.Config.Labels,
            env: data.Config.Env
        }
        return container
    }
}

function formatMounts(data: ContainerInfo['Mounts']): ContainerMount[] {
    const mountList = []
    for (const mount of data){
        const formattedMount: ContainerMount = {
            type: mount.Type,
            name: mount.Name || null,
            source: mount.Source || null,
            destination: mount.Destination || null,
            driver: mount.Driver || null,
            mode: mount.Mode,
            rw: mount.RW,
            propagation: mount.Propagation
        }
        mountList.push(formattedMount)
    } return mountList
}

function formatInspectPorts(data: ContainerInspectInfo['NetworkSettings']['Ports']): ContainerPort[] {
    const portList = []
    for (const port in data) {
        const formattedPort: ContainerPort = {
            containerPort: parseInt(port.split("/")[0]) ,
            hostPort: data[port]['HostPort'] || null,
            hostIP: data[port]['HostIp'] || null,
            type: port.split("/")[1] || null
        }
        portList.push(formattedPort)
    } return portList

}

function formatInfoPorts(data: Port[]): ContainerPort[] {
    const portList = []
    for (const port of data) {
        const formattedPort: ContainerPort = {
            containerPort: port.PrivatePort,
            hostPort: port.PublicPort || null,
            hostIP: port.IP || null,
            type: port.Type || null
        }
        portList.push(formattedPort)
    } return portList

}

async function getIconUrl(labels: Container['labels']) {
    if (labels["org.opencontainers.image.vendor"] && labels["org.opencontainers.image.title"]){
        switch(labels["org.opencontainers.image.vendor"].toLowerCase()) {
            case 'linuxserver.io': {
                const url = `https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/${labels["org.opencontainers.image.title"].toLowerCase()}-logo.png`
                const response = await fetch(url)
                if (response.ok && response.status != 404) {
                    return url
                } else return 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png'
            }
            case 'portainer.io': {
                return labels["com.docker.desktop.extension.icon"]
            }
            default: {
                return null
            }
        }
    } else return null

}

export async function normalizeContainers(data: ContainerInfo[]): Promise<Container[]> {
    const containerList: Container[] =[]
    for (const container of data){
        containerList.push(await normalizeContainer(container))
    } return containerList
}

export function formatInspect(data:ReadableContainerInfo) {

    data['CreatedDate'] = format(parseISO(data['Created'].toString()), 'MM/dd/yyyy')
    data['ShortId'] = data['Id'].substring(0,10)
    data['ShortName'] = data['Name'].slice(1)
    return {...data}
}