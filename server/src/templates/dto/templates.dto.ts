import { YachtTemplate } from "@yacht/types";
import { PortainerV1Template, PortainerV2Template } from "@yacht/types";
import { YachtV1Template, YachtV2Template } from "@yacht/types";

export class addYachtTemplateDTO {
    name: string;
    url: string;
}

export class getYachtTemplateDTO implements YachtTemplate {
    name: string;
    url: string;
    description?: string;
    featured?: number[];
    templates: PortainerV1Template[] | PortainerV2Template['templates'] | YachtV1Template[] | YachtV2Template[];
}

