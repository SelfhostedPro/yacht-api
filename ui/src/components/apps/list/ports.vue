<template v-if="app.ports">
    <v-btn elevation="4" variant="tonal" size="small" class="ma-1" v-for="port in app.ports" :key="port.containerPort"
        :color="port.hostPort ? 'primary' : 'error'"> {{
            port.hostPort ? port.hostPort : port.containerPort }}</v-btn>
</template>

<script setup lang="ts">
import { Container } from '@yacht/types';
interface Props {
    app: Container
}
defineProps<Props>()

// // Remove IPv6 port entries for cleaner look.
// const CleanPorts = function (app: Container) {
//     const portList = []
//     for (const port in app.ports) {
//         if (app.ports[port]["hostIp"] !== "::" || !app.ports[port].hasOwnProperty('IP')) {
//             portList.push(app.ports[port])
//         }
//     }
//     return portList
// }

</script>