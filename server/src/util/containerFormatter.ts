import { format, parseISO } from 'date-fns'
import { ContainerCreateOptions, ContainerInfo, ContainerInspectInfo, Port } from 'dockerode'
import { Container, ContainerMount, ContainerPort, CreateContainerForm } from '@yacht/types'

export interface ReadableContainerInfo extends ContainerInfo {
    CreatedDate?: string | number,
    ShortId?: string,
    ShortName?: string,
    PortDetails?: string
}

export interface FixedContainerInspectInfo extends ContainerInspectInfo {
    Mounts: Array<{
        Name?: string | undefined;
        Type?: "volume" | "bind" | "tmpfs";
        Source: string;
        Destination: string;
        Driver?: string | undefined;
        Mode: string;
        RW: boolean;
        Propagation: string;
    }>;
}
export interface FixedContainerInfo extends ContainerInfo {
    Mounts: Array<{
        Name?: string | undefined;
        Type: "volume" | "bind" | "tmpfs";
        Source: string;
        Destination: string;
        Driver?: string | undefined;
        Mode: string;
        RW: boolean;
        Propagation: string;
    }>;
}

function isContainerInfo(obj: any): obj is FixedContainerInfo {
    return typeof obj.State === "string"
}
function isContainerInspectInfo(obj: any): obj is FixedContainerInspectInfo {
    return obj.State instanceof Object
}

export async function normalizeContainer(data: FixedContainerInspectInfo): Promise<Container>
export async function normalizeContainer(data: FixedContainerInfo): Promise<Container>
export async function normalizeContainer(data: FixedContainerInfo | FixedContainerInspectInfo): Promise<Container> {
    if (isContainerInfo(data)) {
        const container: Container = {
            name: data.Names[0].slice(1),
            id: data.Id,
            shortId: data['Id'].substring(0, 10),
            image: data['Image'],
            created: format(new Date(data.Created * 1000), 'MM/dd/yyyy'),
            status: data.State,
            state: data.Status,
            info: {
                title: data.Labels["org.opencontainers.image.title"],
                description: data.Labels["org.opencontainers.image.description"],
                docs: data.Labels["org.opencontainers.image.documentation"],
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
            shortId: data['Id'].substring(0, 10),
            image: data.Config.Image,
            created: format(parseISO(data['Created'].toString()), 'MM/dd/yyyy'),
            status: data.State.Status,
            restart: {
                policy: data.HostConfig.RestartPolicy.Name,
                count: data.RestartCount
            },
            info: {
                title: data.Config.Labels["org.opencontainers.image.title"],
                description: data.Config.Labels["org.opencontainers.image.description"],
                docs: data.Config.Labels["org.opencontainers.image.documentation"],
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
            ports: Object.keys(data.NetworkSettings.Ports).length ? formatInspectPorts(data) : null,
            labels: data.Config.Labels,
            env: data.Config.Env
        }
        return container
    }
}

function formatMounts(data: FixedContainerInspectInfo['Mounts'])
function formatMounts(data: FixedContainerInfo['Mounts']): ContainerMount[] {
    return data.map(({ Type, Name, Source, Destination, Driver, Mode, RW, Propagation }) => ({
        type: Type ?? null,
        name: Name ?? null,
        source: Source ?? null,
        destination: Destination ?? null,
        driver: Driver ?? null,
        mode: Mode,
        rw: RW,
        propagation: Propagation,
    }));
}



function splitPort(port) {
    const [portNumber, type] = port.split('/');
    return { containerPort: parseInt(portNumber), type };
}
// Runs on inspect in order to convert them to a more usable format.
function formatInspectPorts(data: ContainerInspectInfo): ContainerPort[] {
    const portList: Set<ContainerPort> = new Set();
    const { NetworkSettings, Config } = data;
    // Check network settings for mapped ports
    Object.entries(NetworkSettings.Ports).forEach(([port, forwarded]) => {
        const formattedPort: ContainerPort = { ...splitPort(port) };
        if (forwarded) {
            formattedPort.hostPort = parseInt(forwarded[0].HostPort);
            formattedPort.hostIP = forwarded[0].HostIp;
        }
        portList.add(formattedPort);
    })
    // Check config for additional ports that might not be mapped
    Object.entries(Config.ExposedPorts).forEach(([port, _]) => {
        const { containerPort, type } = splitPort(port);
        // Check to make sure the port doesn't already exist
        if (containerPort! in portList.values()) {
            portList.add({
                containerPort,
                type: type || null,
                hostPort: null,
                hostIP: null
            });
        }
    })
    return Array.from(portList);
}

function formatInfoPorts(data: Port[]): ContainerPort[] {
    return data.map(({ PrivatePort, PublicPort = null, IP = null, Type = null }) => ({
        ...{ containerPort: PrivatePort, hostPort: PublicPort, hostIP: IP, type: Type }
    }));
}

async function getIconUrl(labels: Container['labels']) {
    if (labels["org.opencontainers.image.vendor"] && labels["org.opencontainers.image.title"]) {
        const vendor = labels["org.opencontainers.image.vendor"]?.toLowerCase();
        const title = labels["org.opencontainers.image.title"]?.toLowerCase();
        switch (vendor) {
            case 'linuxserver.io': {
                const url = `https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/${title}-logo.png`
                const response = await fetch(url)
                if (response.ok && response.status != 404) {
                    return url
                } else return 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png'
            }
            case 'portainer.io': {
                return labels["com.docker.desktop.extension.icon"] || null;
            }
            default: {
                return labels['sh.yacht.icon'] || null;
            }
        }
    } else return null
}

export async function normalizeContainers(data: ContainerInfo[]): Promise<Container[]> {
    const promises = data.map(normalizeContainer);
    return Promise.all(promises);
}

export async function normalizeCreate(data: CreateContainerForm): Promise<ContainerCreateOptions> {
    const {
        name,
        image,
        restart,
        network,
        network_mode,
        mounts,
        ports,
        env,
        command,
        devices,
        sysctls,
        capabilities,
        limits,
    } = data;

    const transformedLabels = await transformInfo(data);

    const containerCreateOptions: ContainerCreateOptions = {
        name,
        Image: image,
        HostConfig: {
            RestartPolicy: { Name: restart },
            NetworkMode: network_mode || network,
            Binds: mounts.map(({ source, destination, read_only }) => `${source}:${destination}${ read_only ? ':ro' : ''}`),
            Devices: devices,
            PortBindings: ports.reduce((acc, { container, host, protocol }) => {
                acc[container+'/'+protocol] = [{ HostPort: host }];
                return acc;
            }, {} as { [index: string]: object }),
            Sysctls: sysctls.reduce((acc, { key, value }) => {
                acc[key] = value;
                return acc;
            }, {} as { [index: string]: string }),
            CapAdd: capabilities.add,
            CapDrop: capabilities.drop,
            CpuShares: limits.cpus,
            Memory: limits.mem_limit,
        },
        Env: env.map(({ key, value }) => `${key}=${value}`),
        Labels: transformedLabels,
        Cmd: command,
    };

    return containerCreateOptions;
}

export async function transformInfo(data: CreateContainerForm) {
    const { labels, info, ports } = data;
    const baseLabels = Object.fromEntries(labels.map(({ key, value }) => [key, value]));
    const infoLabels = Object.fromEntries(Object.entries(info).map(([key, value]) => [`sh.yacht.${key}`, value]));
    const portLabels = Object.fromEntries(ports.map((port) => [`sh.yacht.${port.host}`, port.label]));
    const transformedLabels = Object.assign({}, baseLabels, infoLabels, portLabels);

    return transformedLabels;
}
