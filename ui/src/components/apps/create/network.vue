<template>
    <v-card :rounded="0" color="foreground">
        <v-toolbar :rounded="0" color="surface">
            <v-toolbar-title class="text-center"> network </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-slide-x-transition>
                <v-combobox clearable v-show="networkMode === 'none' || !networkMode" :items="networkItems" label="network"
                    v-model="network" required></v-combobox>
            </v-slide-x-transition>
            <v-slide-x-transition>
                <v-select clearable v-show="network === 'none' || !network" :items="['bridge', 'host', 'none']"
                    label="network mode" v-model="networkMode" required></v-select>
            </v-slide-x-transition>
            <v-slide-x-transition group>
                <v-row align="center" no-gutters class="my-2" v-if="networkMode === 'bridge' || network === 'bridge'"
                    v-for="port, i in ports" :key="i">
                    <v-col :cols="formCols('card')">
                        <v-card>
                            <v-card-text>
                                <v-row align="center">
                                    <v-col :cols="formCols('label')">
                                        <v-text-field label="label" placeholder="webui" v-model="port.label"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('host')">
                                        <v-text-field label="host" placeholder="8080" v-model="port.host"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('container')">
                                        <v-text-field label="container" placeholder="80" v-model="port.container"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('protocol')">
                                        <v-select label="protocol" :items="['udp', 'tcp']" v-model="port.protocol"
                                            hide-details="auto"></v-select>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col class="text-center" :cols="formCols('button')">
                        <v-btn icon variant="plain" @click="delPort(i)" class="mx-auto"><v-icon icon="mdi-minus" /></v-btn>
                    </v-col>
                </v-row>
            </v-slide-x-transition>
        </v-card-text>
        <addbutton v-if="networkMode === 'bridge' || network === 'bridge'" :resources="ports" name="port"
            @add="addPort()" />
    </v-card>
</template>

<script setup lang="ts">
import { ContainerFormPorts } from '@yacht/types'
import { Ref, ref } from 'vue';
import { useDisplay } from 'vuetify';
import addbutton from './shared/addButton.vue'
import { useResourceStore } from '@/stores/resources';
import { onMounted } from 'vue';
const resourceStore = useResourceStore()
const { smAndDown } = useDisplay()
const networkItems = ref([])
const network = ref('bridge')
const networkMode = ref('')
const ports: Ref<ContainerFormPorts[]> = ref([] as ContainerFormPorts[])
const delPort = (idx: number) => {
    ports.value.splice(idx, 1)
}
const addPort = () => {
    ports.value.push({
        label: '',
        host: '',
        container: '',
        protocol: 'tcp'
    })
}
const formCols = (field: 'label' | 'host' | 'container' | 'protocol' | 'card' | 'button') => {
    const cols = {
        label: { sm: '12', other: '4' },
        host: { sm: '12', other: '3' },
        container: { sm: '12', other: '3' },
        protocol: { sm: '12', other: '2' },
        card: { sm: '10', other: '11' },
        button: { sm: '2', other: '1' }
    };
    return smAndDown.value === true ? cols[field].sm : cols[field].other;
};
onMounted(async () => {
    await resourceStore.fetchResources('networks').then(() => {
        for (const [, value] of Object.entries(resourceStore.networks)) {
            for (const network of value) {
                networkItems.value.push(network.Name);
            }
        }
    });

})
</script>