import { YachtV1Template } from "./yacht";
export interface PortainerV1Template extends YachtV1Template {
    type: number;
    ports?: string[];
}
export interface PortainerV2Template {
    version: '2';
    templates: PortainerV1Template[];
}
