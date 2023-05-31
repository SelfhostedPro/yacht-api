<template>
    <v-card color="foreground" :loading="isLoading.loading">
        <title-bar class="form-bar" color="primary" @maximize="$emit('maximize')" @close="$emit('close')" :closable="true"
            :title="`create ${form.name || 'new app'}`" />
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <v-row>
            <v-col cols="4">
                <v-card-text class="d-flex align-start justify-start">
                    <formProgress v-model="step" />
                </v-card-text>
            </v-col>
            <v-col>
                <v-window v-model="step" direction="vertical"
                    :style="maximize ? 'max-height: 80vh; overflow: scroll' : 'max-height: 60vh; overflow: scroll'">
                    <v-window-item>
                        <Dynamic name="base" v-model="form" :servers="servers" />
                    </v-window-item>
                    <v-window-item>
                        <Dynamic name="info" v-model="form" />
                    </v-window-item>
                    <v-window-item>
                        <network :networks="networks" v-model="form" />
                    </v-window-item>
                    <v-window-item>
                        <Dynamic name="storage" v-model="form.mounts" />
                    </v-window-item>
                    <v-window-item>
                        <Dynamic title="environment" name="variables" :use-card="true" v-model="form.env" />
                    </v-window-item>
                </v-window>
            </v-col>
        </v-row>
        <v-card-actions style="background-color: rgb(var(--v-theme-surface)) !important;">
            <v-spacer />
            <v-btn v-if="step !== 0" @click="step--">prev</v-btn>
            <v-btn v-if="step !== 4" color="primary" @click="step++">next</v-btn>
            <v-btn v-else color="primary" @click="submit()">submit</v-btn>
        </v-card-actions>
        <advanced v-model="form" :template="template" />
    </v-card>
</template>

<script setup lang="ts">
import TitleBar from '../common/TitleBar.vue';
import formProgress from './create/form-progress.vue';
import Dynamic from './create/dynamic.vue'
import advanced from './create/advanced.vue';
import network from './create/network.vue'


import { storeToRefs } from 'pinia';
import { CreateContainerForm, YachtTemplate, YachtV1TemplatePort, YachtV2TemplatePort } from '@yacht/types';
import { Ref, ref, onMounted, onBeforeUnmount } from 'vue';

import { useAppStore } from '@/stores/apps';
import { useLoadingStore } from '@/stores/loading';
import { useResourceStore } from '@/stores/resources';
import { useSettingsStore } from '@/stores/settings';
const props = defineProps(['template', 'maximize'])
const emit = defineEmits(['close', 'maximize'])

// Store Variables
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
const resourceStore = useResourceStore()
const { networks } = storeToRefs(resourceStore)
const settingStore = useSettingsStore()
const appStore = useAppStore()

// Form Variables
const step: Ref<number> = ref(0)
const form: Ref<CreateContainerForm> = ref({
    name: '', image: '', server: '',
    info: { icon: '', title: '', notes: '' },
    env: [], mounts: [], ports: [], devices: [],
    sysctls: [], labels: [], command: [],
    capabilities: { add: [], drop: [] },
    limits: { cpu: '', memory: '' },
} as CreateContainerForm)

// Dynamic Form Options
const servers = ref([])

onMounted(async () => {
    if (props.template) {
        await populateFromTemplate()
    } else if (localStorage.getItem('createAppForm')) {
        form.value = JSON.parse(localStorage.getItem('createAppForm'))
    }
    await resourceStore.fetchResources('networks')
    await settingStore.fetchServers().then(() => {
        for (const [, server] of Object.entries(settingStore.servers)) {
            servers.value.push(server.name);
        }
        form.value.server = servers.value[0] || 'none'
        form.value.network ? form.value.network = form.value.network : form.value.network = networks.value[servers.value[0]].find((network) => network.Name === 'bridge').Name || 'none'
    });
})


// Populate Form from Templates
const populateFromTemplate = async () => {
    form.value.name = props.template.name
    form.value.image = props.template.image
    form.value.restart = props.template.restart_policy
    form.value.info.icon = props.template.logo
    form.value.info.title = props.template.title
    form.value.network = props.template.ports ? 'bridge' : null
    form.value.env = props.template.env?.map((env) => {
        return {
            name: env.name,
            value: env.default,
            label: env.label,
            description: env.description
        }
    }) || []
    form.value.mounts = props.template.volumes.map((volume) => {
        return {
            source: volume.container,
            destination: volume.bind,
            read_only: volume.readonly || false,
        }
    }) || []
    form.value.labels = props.template.labels || []
    form.value.ports = formatPorts(props.template.ports)
    form.value.command = props.template.command ? [props.template.command] : []
    form.value.sysctls = props.template.sysctls || []
    form.value.devices = props.template.devices || []
    form.value.capabilities.add = props.template.cap_add || []
    form.value.capabilities.drop = props.template.cap_drop || []
    form.value.limits = props.template.limits || {
        cpus: null,
        mem_limit: null,
    }
}

const formatPorts = (ports: YachtTemplate['templates'][0]['ports']): CreateContainerForm['ports'] => {
    console.log(JSON.stringify(ports))
    const portList: CreateContainerForm['ports'] = []
    const isPortainerPorts = (ports: unknown): ports is string[] => {
        return Array.isArray(ports) && typeof ports[0] === 'string'
    }

    const isYachtV1Ports = (ports: unknown): ports is YachtV1TemplatePort[] => {
        return Array.isArray(ports) && typeof ports[0] === 'object'
    }

    const isYachtV2Ports = (ports: unknown): ports is YachtV2TemplatePort => {
        console.log(ports)
        return !Array.isArray(ports) && typeof ports === 'object'
    }

    if (isPortainerPorts(ports)) {
        console.log('isPortainerPorts')
        for (const port in ports) {
            ports = ports as string[]
            const portString: string = ports[port]
            if (portString.includes(':') && portString.includes('/')) {
                const [host, container] = portString.split(':')
                const [containerPort, protocol] = container.split('/')
                portList.push({ host: host, container: containerPort, protocol: protocol === 'upd' ? 'udp' : 'tcp' })
            } else if (portString.includes(':')) {
                const [host, container] = portString.split(':')
                portList.push({ host, container, protocol: 'tcp' })
            } else if (portString.includes('/')) {
                const [container, protocol] = portString.split('/')
                portList.push({ container, protocol: protocol === 'upd' ? 'udp' : 'tcp' })
            } else {
                portList.push({ container: port, protocol: 'tcp' })
            }
        }
        return portList
    } else if (isYachtV1Ports(ports)) {
        console.log('isYachtV1Ports')
        const portObject = ports[0]
        for (const port in portObject) {
            const portString = portObject[port] as string
            if (portString.includes(':') && portString.includes('/')) {
                const [host, container] = portString.split(':')
                const [containerPort, protocol] = container.split('/')
                portList.push({ label: port, host: host, container: containerPort, protocol: protocol === 'upd' ? 'udp' : 'tcp' })
            } else if (portString.includes(':')) {
                const [host, container] = portString.split(':')
                portList.push({ label: port, host, container, protocol: 'tcp' })
            } else if (portString.includes('/')) {
                const [container, protocol] = port.split('/')
                portList.push({ label: port, container, protocol: protocol === 'upd' ? 'udp' : 'tcp' })
            } else {
                portList.push({ label: port, container: port, protocol: 'tcp' })
            }
        }
        return portList
    } else if (isYachtV2Ports(ports)) {
        console.log('isYachtV2Ports')
        Object.keys(ports).forEach((port) => {
            const portObject = ports[port]
            portList.push({
                label: port,
                host: portObject.host,
                container: portObject.container,
                protocol: portObject.protocol,
                description: portObject.description,
                unchangable: portObject.unchangable || false
            })
        })
        return portList
    } else {
        console.log('isUnknownPorts')
    }
    return portList
}

// Submit Form
const submit = async () => {
    await appStore.createApp(form.value)
        .then(() => {
            emit('close')
        })
        .catch((e) => {
            return
        })
}
onBeforeUnmount(() => {
    localStorage.setItem('createAppForm', JSON.stringify(form.value))
})
</script>
<style></style>