<template>
    <v-btn v-if="app.Ports" elevation="4" variant="tonal" size="small" class="ma-1" v-for="port in CleanPorts(app)"
        :key="port.PrivatePort" :color="port.hasOwnProperty('PublicPort') ? 'primary' : 'error'"> {{
            port.hasOwnProperty('PublicPort') ? port["PublicPort"] : port["PrivatePort"] }}</v-btn>
</template>

<script setup lang="ts">
import { ReadableContainerInfo } from '@/types/apps';

defineProps(['app'])

// Remove IPv6 port entries for cleaner look.
const CleanPorts = function (app: ReadableContainerInfo) {
    const portList = []
    for (const port in app.Ports) {
        if (app.Ports[port]["IP"] !== "::" || !app.Ports[port].hasOwnProperty('IP')) {
            portList.push(app.Ports[port])
        }
    }
    return portList
}

</script>