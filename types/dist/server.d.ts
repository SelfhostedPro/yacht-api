import Docker from 'dockerode';
import { Container } from './apps';
export type ServerDict = {
    [key: string]: Docker;
};
export type ServerContainers = {
    [key: string]: Container[];
};
export type ServerImages = {
    [key: string]: Docker.ImageInfo[];
};
export type ServerVolumes = {
    [key: string]: Docker.VolumeInspectInfo[];
};
export type ServerNetworks = {
    [key: string]: Docker.NetworkInspectInfo[];
};
