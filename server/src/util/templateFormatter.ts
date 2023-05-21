import { PortainerV1Template, PortainerV2Template, YachtV1Template, YachtV2Template } from "@yacht/types"

function isPortainerV1Template(template: any): template is PortainerV1Template {
        return Array.isArray(template);
}
function isPortainerV2Template(template: unknown): template is PortainerV2Template {
    return template['version'] && template['version'] === '2' ? true : false
}
function isYachtV1Template(template: unknown): template is YachtV1Template {
    return Array.isArray(template) && template.some((templateItem) => templateItem['ports'] && typeof templateItem.ports[0] !== 'string');

}
function isYachtV2Template(template: unknown): template is YachtV2Template {
    return !Array.isArray(template) && (!template.hasOwnProperty('version') || !Array.isArray(template) && template['type'] == 'yachtv2');
}

export function getTemplateType(template: PortainerV1Template | PortainerV2Template | YachtV1Template | YachtV2Template) {
    if (isYachtV1Template(template)) {
        return 'yachtv1'
    } else if (isYachtV2Template(template)) {
        return 'yachtv2'
    } else if (isPortainerV2Template(template)) {
        return 'portainerv2'
    } else if (isPortainerV1Template(template)) {
        return 'portainerv1'
    } else {
        throw new Error('Unknown template type')
    }
}