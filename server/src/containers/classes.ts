import { ContainerInfo, Port, NetworkInfo } from 'dockerode';
import { ApiProperty } from '@nestjs/swagger';

export class ContainerInfoDTO implements ContainerInfo {
  @ApiProperty()
  Id: string;
  @ApiProperty()
  Names: string[];
  @ApiProperty()
  Image: string;
  @ApiProperty()
  ImageID: string;
  @ApiProperty()
  Command: string;
  @ApiProperty()
  Created: number;
  @ApiProperty()
  Ports: Port[];
  @ApiProperty()
  Labels: { [label: string]: string };
  @ApiProperty()
  State: string;
  @ApiProperty()
  Status: string;
  @ApiProperty()
  HostConfig: { NetworkMode: string };
  @ApiProperty()
  NetworkSettings: { Networks: { [networkType: string]: NetworkInfo } };
  @ApiProperty()
  Mounts: {
    Name?: string | undefined;
    Type: string;
    Source: string;
    Destination: string;
    Driver?: string | undefined;
    Mode: string;
    RW: boolean;
    Propagation: string;
  }[];
}

export class ContainerProcessesDTO {
  @ApiProperty()
  Titles: string[];
  @ApiProperty()
  Processes: string[][];
}

export class ContainerStatsDTO {
  
}