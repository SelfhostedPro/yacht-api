<template>
    <v-card color="foreground">
        <BaseInfo :servers="servers" v-model="form"></BaseInfo>
        <v-card color="secondary">
            <v-window v-model="currentWindow">
                <v-window-item :value="0">
                    <NetworkInfo :networks="networks" v-model="form"></NetworkInfo>
                </v-window-item>
                <v-window-item :value="1">
                    <Dynamic name="volumes" :use-card="true" v-model="form.mounts" />
                </v-window-item>
                <v-window-item :value="2">
                    <Dynamic title="environment" name="variables" :use-card="true" v-model="form.env" />
                </v-window-item>
                <v-window-item>
                </v-window-item>
            </v-window>
            <v-card-actions>
                <v-spacer />
                <v-btn v-if="!(currentWindow === 0)" @click="prev">Previous</v-btn>
                <v-btn v-if="currentWindow < 2" variant="text" color="primary" @click="next">Next</v-btn>
                <v-btn v-else variant="text" color="primary" :loading="isLoading.items.has('deploy')"
                    @click="submit">Submit</v-btn>
            </v-card-actions>
        </v-card>
        <v-divider />
        <v-toolbar @click="advancedToggle = !advancedToggle" color="surface" dark>
            <v-row>
                <v-col cols="1">
                </v-col>
                <v-col>
                    <v-toolbar-title class="text-center">advanced</v-toolbar-title>
                </v-col>
                <v-col cols="1">
                    <v-toolbar-items class="float-right">
                        <v-tooltip text="preview">
                            <template v-slot:activator="{ props }">
                                <v-btn @click="advancedToggle = !advancedToggle" v-bind="props" variant="text"
                                    :icon="advancedToggle ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                            </template>
                        </v-tooltip>
                    </v-toolbar-items>
                </v-col>
            </v-row>
        </v-toolbar>
        <v-card color="foreground" v-show="advancedToggle">
            <v-card-text>
                <v-expand-transition>
                    <v-expansion-panels multiple color="surface" selected-class="" variant="popout">
                        <Dynamic name="command" v-model="form.command" />
                        <Dynamic name="labels" v-model="form.labels" />
                        <Dynamic name="sysctls" v-model="form.sysctls" />
                        <Dynamic name="devices" v-model="form.devices" />
                        <Dynamic name="capabilities" v-model="form.capabilities" />
                        <Dynamic name="limits" v-model="form.limits" />
                        <v-expansion-panel title="raw">
                            <v-expansion-panel-text>
                                <v-card title="form">
                                    <pre>{{ form }}</pre>
                                </v-card>
                                <v-card title="template">
                                    <pre>{{ template }}</pre>
                                </v-card>
                                <v-card title="ports">
                                    <pre>{{ formatPorts(props.template.ports) }}</pre>
                                </v-card>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-expand-transition>
            </v-card-text>
        </v-card>
    </v-card>
</template>
  

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { CreateContainerForm, YachtTemplate } from '@yacht/types';
import BaseInfo from './create/base.vue'
import NetworkInfo from './create/network.vue'
import Dynamic from './create/dynamic.vue'
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { useResourceStore } from '@/stores/resources';
import { useLoadingStore } from '@/stores/loading'
import { useAppStore } from '@/stores/apps';
import { onBeforeUnmount } from 'vue';

const appStore = useAppStore()
const resourceStore = useResourceStore()
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
const { networks } = storeToRefs(resourceStore)

interface Props {
    template?: YachtTemplate['templates'][0],
}

const emit = defineEmits(['created'])
const props = defineProps<Props>()

const servers = ref([])
const settingStore = useSettingsStore()
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


const form: Ref<CreateContainerForm> = ref({
    name: '',
    image: '',
    server: '',
    info: {
        icon: '',
        title: '',
        notes: '',
    },
    env: [],
    mounts: [],
    command: [],
    ports: [],
    labels: [],
    devices: [],
    sysctls: [],
    capabilities: {
        add: [],
        drop: [],
    },
    limits: {
        cpu: '',
        memory: '',
    },
} as CreateContainerForm)

const advancedToggle = ref(false)
const currentWindow = ref(0)

const next = () => {
    return currentWindow.value += 1
}
const prev = () => {
    return currentWindow.value -= 1
}

const populateFromTemplate = async () => {
    form.value.name = props.template.name
    form.value.image = props.template.image
    form.value.restart = props.template.restart_policy
    form.value.info.icon = props.template.logo
    form.value.info.title = props.template.title
    form.value.network = props.template.ports ? 'bridge' : null
    form.value.env = props.template.env.map((env) => {
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
    const portList: CreateContainerForm['ports'] = []
    ports.forEach((port: YachtTemplate['templates'][0]['ports'][0]) => {
        if (typeof port === 'string') {
            if (port.includes(':')) {
                const [host, container] = port.split(":")
                if (container.includes('/')) {
                    const [containerPort, protocol] = container.split('/')
                    portList.push({
                        label: undefined,
                        host,
                        container: containerPort,
                        protocol: protocol === 'udp' ? 'udp' : 'tcp',
                    })
                } else {
                    portList.push({
                        label: undefined,
                        host,
                        container,
                        protocol: 'tcp',
                    })
                }
            } else {
                if (port.includes('/')) {
                    const [containerPort, protocol] = port.split('/')
                    portList.push({
                        label: undefined,
                        host: '',
                        container: containerPort,
                        protocol: protocol === 'udp' ? 'udp' : 'tcp',
                    })
                } else {
                    portList.push({
                        label: undefined,
                        host: '',
                        container: port,
                        protocol: 'tcp',
                    })
                }
            }
        } else if (typeof port === 'object') {
            for (const [label, portString] of Object.entries(port)) {
                if (portString.includes(':')) {
                    const [host, container] = portString.split(":")
                    if (container.includes('/')) {
                        const [containerPort, protocol] = container.split('/')
                        portList.push({
                            label,
                            host,
                            container: containerPort,
                            protocol: protocol === 'udp' ? 'udp' : 'tcp',
                        })
                    } else {
                        portList.push({
                            label,
                            host,
                            container,
                            protocol: 'tcp',
                        })
                    }
                } else {
                    if (portString.includes('/')) {
                        const [containerPort, protocol] = portString.split('/')
                        portList.push({
                            label,
                            host: '',
                            container: containerPort,
                            protocol: protocol === 'udp' ? 'udp' : 'tcp',
                        })
                    } else {
                        portList.push({
                            label,
                            host: '',
                            container: portString,
                            protocol: 'tcp',
                        })
                    }
                }
            }
        }
    })
    return portList
};



const submit = async () => {
    await appStore.createApp(form.value)
        .then(() => {
            emit('created')
        })
        .catch((e) => {
            return
        })
}
onBeforeUnmount(() => {
    localStorage.setItem('createAppForm', JSON.stringify(form.value))
})

</script>
