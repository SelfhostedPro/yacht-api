import Docker from 'dockerode';
import { Container } from './apps';

export type ServerDict = {
    [key: string]: Docker
}

export type ServerContainers = {
    [key: string]: Container[]
}