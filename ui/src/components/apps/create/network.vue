<template>
    <v-card color="foreground">
        <v-card-title class="text-center"> networking </v-card-title>
        <v-card-text>
            <v-slide-x-transition>
                <v-combobox v-show="networkMode === 'none' || !networkMode"
                    :items="['bridge', 'host', 'something', 'none']" label="network" v-model="network"
                    required></v-combobox>
            </v-slide-x-transition>
            <v-slide-x-transition>
                <v-select v-show="network === 'none' || !network" :items="['bridge', 'host', 'none']" label="network mode"
                    v-model="networkMode" required></v-select>
            </v-slide-x-transition>
            <v-slide-x-transition group>
                <v-row v-if="networkMode === 'bridge' || network === 'bridge'" v-for="port, i in ports" :key="i">
                    <v-col>
                        <v-text-field label="label" placeholder="webui" v-model="port.label" required></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field label="host" placeholder="8080" v-model="port.host" required></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field label="container" placeholder="80" v-model="port.container" required></v-text-field>
                    </v-col>
                    <v-col>
                        <v-select label="protocol" :items="['udp', 'tcp']" v-model="port.protocol"></v-select>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon variant="plain" @click="delPort(i)" class="mx-auto my-auto"><v-icon
                                icon="mdi-minus" /></v-btn>
                    </v-col>
                </v-row>
            </v-slide-x-transition>
        </v-card-text>
        <v-btn v-if="networkMode === 'bridge' || network === 'bridge'" @click="addPort()" size="x-large" class="float-right"><v-icon icon="mdi-plus" /></v-btn>
    </v-card>
</template>

<script setup lang="ts">
import { ContainerFormPorts } from '@yacht/types'
import { Ref, ref } from 'vue';
const network = ref('')
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
</script>