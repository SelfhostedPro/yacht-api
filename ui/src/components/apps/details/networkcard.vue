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
                        <tr v-for="port of app.ports" :key="port.containerPort">
                            <td class="text-left">{{ port.containerPort }}</td>
                            <td v-if="port.hostIP" class="text-center">{{
                                port.hostIP }}</td>
                            <td v-else class="text-center">-</td>
                            <td v-if="port.hostPort" class="text-right"><v-btn color="primary"><v-icon
                                        icon="mdi-link-variant" /> {{
                                            port.hostPort }}</v-btn></td>
                            <td v-else class="text-right">-</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-window-item>
            <v-window-item value="1">
                <v-list>
                    <v-list-item v-for="network, name in app.config.network.networks" :key="name">
                        <v-list-item-title>{{ name }}</v-list-item-title>
                        <v-list-item-subtitle>ip address: {{ network.IPAddress + '/' + network.IPPrefixLen }}</v-list-item-subtitle>
                        <v-list-item-subtitle>gateway: {{ network.Gateway+'/'+network.IPPrefixLen }}</v-list-item-subtitle>
                        <v-list-item-subtitle>id: {{ network.NetworkID }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-window-item>
            <v-window-item value="2">
                <v-list>
                    <!-- <v-list-item v-for="setting in networkSettings">
                        <v-list-item-title>{{ setting.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ setting.main }}</v-list-item-subtitle>
                        <v-list-item-subtitle v-if="setting.sub">{{ setting.sub }}</v-list-item-subtitle>
                    </v-list-item> -->
                </v-list>
            </v-window-item>
        </v-window>
        <!-- <pre>{{ app.ports }} {{ app.config.network }}</pre> -->
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@/types/apps';
import { ref } from 'vue';
interface Props {
    app: Container
}
defineProps<Props>()
const tab = ref(0)
</script>