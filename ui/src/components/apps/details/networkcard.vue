<template>
    <v-card>
        <v-toolbar>
            <v-toolbar-title>networking</v-toolbar-title>
        </v-toolbar>
        <v-tabs v-model="tab" color="primary">
            <v-tab rounded="0" value="0" title="ports" />
            <v-tab rounded="0" value="1" title="networks" />
            <v-tab rounded="0" value="2" title="advanced" />
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item value="0">
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                                container port
                            </th>
                            <th class="text-center">
                                host ip
                            </th>
                            <th class="text-right">
                                host port
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="_, port, i in app.Config.ExposedPorts" :key="i">
                            <td class="text-left">{{ port }}</td>
                            <td v-if="app.NetworkSettings.Ports[port]" class="text-center">{{
                                app.NetworkSettings.Ports[port][0].HostIp }}</td>
                            <td v-else class="text-center">-</td>
                            <td v-if="app.NetworkSettings.Ports[port]" class="text-right"><v-btn color="primary"><v-icon
                                        icon="mdi-link-variant" /> {{
                                            app.NetworkSettings.Ports[port][0].HostPort }}</v-btn></td>
                            <td v-else class="text-right">-</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-window-item>
            <v-window-item value="1">
                <v-list>
                    <v-list-item v-for="network, name in app.NetworkSettings.Networks">
                        <v-list-item-title>{{ name }}</v-list-item-title>
                        <v-list-item-subtitle>ip address: {{ network.IPAddress + '/' + network.IPPrefixLen }}</v-list-item-subtitle>
                        <v-list-item-subtitle>gateway: {{ network.Gateway+'/'+network.IPPrefixLen }}</v-list-item-subtitle>
                        <v-list-item-subtitle>id: {{ network.NetworkID }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-window-item>
            <v-window-item value="2">
                <v-list>
                    <v-list-item v-for="setting in networkSettings">
                        <v-list-item-title>{{ setting.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ setting.main }}</v-list-item-subtitle>
                        <v-list-item-subtitle v-if="setting.sub">{{ setting.sub }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@/types/apps';
import { ref } from 'vue';
interface Props {
    app: Container
}
const props = defineProps<Props>()
const tab = ref(0)

const networkSettings = [
    {
        title: "ip address",
        main: props.app.NetworkSettings.IPAddress + '/' + props.app.NetworkSettings.IPPrefixLen
    },
    {
        title: "gateway",
        main: props.app.NetworkSettings.Gateway
    },
    {
        title: "mac address",
        main: props.app.NetworkSettings.MacAddress
    },
    {
        title: "hairpin mode",
        main: props.app.NetworkSettings.HairpinMode
    },
    {
        title: "sandbox",
        main: 'id: '+props.app.NetworkSettings.SandboxID,
        sub: 'key: '+props.app.NetworkSettings.SandboxKey
    },

]
</script>