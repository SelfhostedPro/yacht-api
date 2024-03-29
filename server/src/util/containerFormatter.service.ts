import { format, parseISO } from 'date-fns';
import {
  ContainerCreateOptions,
  ContainerInfo,
  ContainerInspectInfo,
  Port,
} from 'dockerode';
import {
  Container,
  ContainerMount,
  ContainerPort,
  CreateContainerForm,
} from '@yacht/types';
import { ConfigService } from 'src/config/config.service';
import { Injectable } from '@nestjs/common';
import { Logger } from 'src/common/logger/logger.service';
import { FixedContainerInfo, FixedContainerInspectInfo } from './containerFormatter.dto';

@Injectable()
export class ContainerFormatterService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(ContainerFormatterService.name)
  }

  /**
   * Checks if obj is FixedContainerInfo type.
   */
  private isContainerInfo(obj: any): obj is FixedContainerInfo {
    return typeof obj.State === 'string';
  }
  /**
   * Checks if obj is FixedContainerInspectInfo type.
   */
  private isContainerInspectInfo(obj: any): obj is FixedContainerInspectInfo {
    return obj.State instanceof Object;
  }

  /**
   * Normalize container data based on the input data type.
   */
  public async normalizeContainer(data: FixedContainerInspectInfo): Promise<Container>;
  public async normalizeContainer(data: FixedContainerInfo): Promise<Container>;
  public async normalizeContainer(data: FixedContainerInfo | FixedContainerInspectInfo): Promise<Container> {
    if (this.isContainerInfo(data)) {
      return this.normalizeContainerInfo(data);
    } else if (this.isContainerInspectInfo(data)) {
      return this.normalizeContainerInspectInfo(data);
    }
  }

  /**
 * Normalize container data from FixedContainerInfo type.
 */
  private async normalizeContainerInfo(data: FixedContainerInfo): Promise<Container> {
    const container: Container = {
      name: data.Names[0].slice(1),
      id: data.Id,
      shortId: data['Id'].substring(0, 10),
      image: data['Image'],
      created: format(new Date(data.Created * 1000), 'MM/dd/yyyy'),
      status: data.State,
      state: data.Status,
      info: {
        title:
          data.Labels['sh.yacht.title'] ||
          data.Labels['org.opencontainers.image.title'],
        notes: data.Labels['sh.yacht.notes'],
        description: data.Labels['org.opencontainers.image.description'],
        docs: data.Labels['org.opencontainers.image.documentation'],
        url: data.Labels['org.opencontainers.image.url'],
        source: data.Labels['org.opencontainers.image.source'],
        vendor: data.Labels['org.opencontainers.image.vendor'],
        icon: await this.getIconUrl(data.Labels),
      },
      config: {
        network: {
          mode: data.HostConfig.NetworkMode,
          networks: data.NetworkSettings.Networks,
        },
      },
      mounts: data.Mounts ? this.formatMounts(data.Mounts) : null,
      ports: data.Ports ? this.formatInfoPorts(data.Ports) : null,
      labels: data.Labels,
    };
    return container;
  }

  /**
   * Normalize container data from FixedContainerInspectInfo type.
   */
  private async normalizeContainerInspectInfo(data: FixedContainerInspectInfo): Promise<Container> {
    const container: Container = {
      name: data.Name.slice(1),
      id: data.Id,
      shortId: data['Id'].substring(0, 10),
      image: data.Config.Image,
      created: format(parseISO(data['Created'].toString()), 'MM/dd/yyyy'),
      status: data.State.Status,
      restart: {
        policy: data.HostConfig.RestartPolicy.Name,
        count: data.RestartCount,
      },
      info: {
        title:
          data.Config.Labels['sh.yacht.title'] ||
          data.Config.Labels['org.opencontainers.image.title'],
        notes: data.Config.Labels['sh.yacht.notes'],
        description: data.Config.Labels['org.opencontainers.image.description'],
        docs: data.Config.Labels['org.opencontainers.image.documentation'],
        url: data.Config.Labels['org.opencontainers.image.url'],
        source: data.Config.Labels['org.opencontainers.image.source'],
        vendor: data.Config.Labels['org.opencontainers.image.vendor'],
        icon: await this.getIconUrl(data.Config.Labels),
      },
      config: {
        network: {
          mode: data.HostConfig.NetworkMode,
          networks: data.NetworkSettings.Networks,
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
            config: data.HostConfig.LogConfig.Config,
          },
          args: data.Args,
        },
      },
      mounts: data.Mounts ? this.formatMounts(data.Mounts) : null,
      ports: Object.keys(data.NetworkSettings.Ports).length
        ? this.formatInspectPorts(data)
        : null,
      labels: data.Config.Labels,
      env: data.Config.Env,
    };
    return container;
  }

  /**
   * Transform mounts data to ContainerMount type.
   */
  private formatMounts(data: FixedContainerInspectInfo['Mounts']);
  private formatMounts(data: FixedContainerInfo['Mounts']): ContainerMount[] {
    return data.map(
      ({ Type, Name, Source, Destination, Driver, Mode, RW, Propagation }) => ({
        type: Type ?? null,
        name: Name ?? null,
        source: Source ?? null,
        destination: Destination ?? null,
        driver: Driver ?? null,
        mode: Mode,
        rw: RW,
        propagation: Propagation,
      }),
    );
  }
  /**
   * Changes a port string to a ContainerPort type.
   */
  private splitPort(port) {
    const [portNumber, type] = port.split('/');
    return { containerPort: parseInt(portNumber), type };
  }
  /**
   * Transform ports data from info to ContainerPort type.
   */
  private formatInspectPorts(data: ContainerInspectInfo): ContainerPort[] {
    const portList: Set<ContainerPort> = new Set();
    const { NetworkSettings, Config } = data;
    // Check network settings for mapped ports
    Object.entries(NetworkSettings.Ports).forEach(([port, forwarded]) => {
      const formattedPort: ContainerPort = { ...this.splitPort(port) };
      if (forwarded) {
        formattedPort.hostPort = parseInt(forwarded[0].HostPort);
        formattedPort.hostIP = forwarded[0].HostIp;
      }
      portList.add(formattedPort);
    });
    // Check config for additional ports that might not be mapped
    Object.entries(Config.ExposedPorts).forEach(([port, _]) => {
      const { containerPort, type } = this.splitPort(port);
      // Check to make sure the port doesn't already exist
      if (containerPort! in portList.values()) {
        portList.add({
          containerPort,
          type: type || null,
          hostPort: null,
          hostIP: null,
        });
      }
    });
    return Array.from(portList);
  }

  /**
   * Transform ports data from inspect to ContainerPort type.
   */
  private formatInfoPorts(data: Port[]): ContainerPort[] {
    return data.reduce(
      (
        acc: ContainerPort[],
        { PrivatePort, PublicPort = null, IP = null, Type = null },
      ) => {
        if (IP !== '::1') {
          acc.push({
            containerPort: PrivatePort,
            hostPort: PublicPort,
            hostIP: IP,
            type: Type,
          });
        }
        return acc;
      },
      [],
    );
  }
  /**
   * Checks to see if the icon url is valid and loads.
   * (Used in order to grab the default LSIO icon if the app's icon returns a 404)
   */
  private async checkUrl(url: string): Promise<string> {
    const DEFAULT_IMAGE_URL = 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png';
    try {
      new URL(url);
      const response = await fetch(url);
      return response.ok && response.status !== 404 ? url : DEFAULT_IMAGE_URL;
    } catch {
      return DEFAULT_IMAGE_URL;
    }
  }
  /**
   * Checks for an icon url in the container's labels.
   * Includes some special cases for certain vendors.
   */
  private async getIconUrl(labels: Container['labels']) {
    if (labels['sh.yacht.icon']) {
      return this.checkUrl(labels['sh.yacht.icon']);
    }
    if (
      labels['org.opencontainers.image.vendor'] &&
      labels['org.opencontainers.image.title']
    ) {
      const vendor = labels['org.opencontainers.image.vendor']?.toLowerCase();
      const title = labels['org.opencontainers.image.title']?.toLowerCase();
      switch (vendor) {
        case 'linuxserver.io': {
          const url = `https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/${title}-logo.png`;
          this.checkUrl(url);
        }
        case 'portainer.io': {
          return labels['com.docker.desktop.extension.icon'] || null;
        }
        default: {
          return labels['sh.yacht.icon'] || null;
        }
      }
    } else return null;
  }
  /**
   * Normalize container data for multiple containers.
   */
  public async normalizeContainers(
    data: ContainerInfo[],
  ): Promise<Container[]> {
    const promises = data.map(this.normalizeContainer, this);
    return Promise.all(promises);
  }

  /**
   * Normalize data from frontend and transform it into a valid ContainerCreateOptions object.
   */
  public async normalizeCreate(
    data: CreateContainerForm,
  ): Promise<ContainerCreateOptions> {
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
    } = await this.transformVariables(data);
    const transformedLabels = await this.transformInfo(data);
    const containerCreateOptions: ContainerCreateOptions = {
      name,
      Image: image,
      HostConfig: {
        RestartPolicy: { Name: restart },
        NetworkMode: network_mode || network,
        Binds: mounts.map(
          ({ source, destination, read_only }) =>
            `${source}:${destination}${read_only ? ':ro' : ''}`,
        ),
        Devices: devices,
        PortBindings: ports.reduce((acc, { container, host, protocol }) => {
          acc[container + '/' + protocol] = [{ HostPort: host }];
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
      Env: env.map(({ name, value }) => `${name}=${value}`),
      Labels: transformedLabels,
      Cmd: command,
    };
    return containerCreateOptions;
  }

  /**
   * Transform data from container create into labels in order to provide additional information about the container.
   */
  private async transformInfo(data: CreateContainerForm) {
    const { labels, info, ports, env } = data;
    const baseLabels = Object.fromEntries(
      labels.map(({ key, value }) => [key, value]),
    );
    const infoLabels = Object.fromEntries(
      Object.entries(info).map(([key, value]) => [`sh.yacht.${key}`, value]),
    );
    const portLabels = Object.fromEntries(
      ports.map((port) => [`sh.yacht.${port.host}`, port.label]),
    );
    const envLabels = Object.fromEntries(
      Object.entries(env).map(([name, env]) => [`sh.yacht.env.${name}.label`, env.label, `sh.yacht.env.${name}.description`, env.description])
    )
    const transformedLabels = Object.assign(
      {},
      baseLabels,
      infoLabels,
      portLabels,
      envLabels,
    );
    return transformedLabels;
  }

  private async transformVariables(data: CreateContainerForm): Promise<CreateContainerForm> {
    const variables = this.configService.yachtConfig?.base['template_variables'];
    const stringData = JSON.stringify(data)
    if (variables) {
      for (const variable of variables) {
        stringData.replaceAll(variable.variable, variable.replacement)
      }
      const replacedData: CreateContainerForm = JSON.parse(stringData)
      return replacedData
    }
    return data;
  }
}


