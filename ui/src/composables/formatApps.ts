import { ref } from 'vue'
import { format, parseISO } from 'date-fns'
import { ContainerInfo } from 'dockerode'

export interface ReadableContainerInfo extends ContainerInfo {
    CreatedDate: string|number,
    ShortId: string,
    ShortName: string
}

export function formatApps(data) {
    const appList: ReadableContainerInfo[] = []

    for (const app in data) {
        data[app]['CreatedDate'] = format(new Date(data[app]['Created'] * 1000), 'MM/dd/yyyy')
        data[app]['ShortId'] = data[app]['Id'].substring(0,10)
        data[app]['ShortName'] = data[app]['Names'][0].slice(1)
        appList.push(data[app])
    }   
    return appList
}

export function formatInspect(data:ReadableContainerInfo) {

    data['CreatedDate'] = format(parseISO(data['Created'].toString()), 'MM/dd/yyyy')
    data['ShortId'] = data['Id'].substring(0,10)
    data['ShortName'] = data['Name'].slice(1)
    return {...data}
}