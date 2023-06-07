import { ContainerInfo, ContainerInspectInfo } from "dockerode";

export interface ReadableContainerInfo extends ContainerInfo {
    CreatedDate?: string | number;
    ShortId?: string;
    ShortName?: string;
    PortDetails?: string;
  }
  
  export interface FixedContainerInspectInfo extends ContainerInspectInfo {
    Mounts: Array<{
      Name?: string | undefined;
      Type?: 'volume' | 'bind' | 'tmpfs';
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
      Type: 'volume' | 'bind' | 'tmpfs';
      Source: string;
      Destination: string;
      Driver?: string | undefined;
      Mode: string;
      RW: boolean;
      Propagation: string;
    }>;
  }