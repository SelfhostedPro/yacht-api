<template>
    <v-card color="foreground">
        <BaseInfo v-model="form"></BaseInfo>
        <v-card color="secondary">
            <v-window v-model="currentWindow">
                <v-window-item :value="0">
                    <NetworkInfo></NetworkInfo>
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
                <v-btn variant="text" color="primary" @click="next">Next</v-btn>
            </v-card-actions>
        </v-card>
        <v-divider />
        <v-toolbar @click="advancedToggle = !advancedToggle" color="surface" dark>
            <v-toolbar-title class="text-center">advanced<v-btn
                    :icon="advancedToggle ? 'mdi-chevron-up' : 'mdi-chevron-down'" /></v-toolbar-title>
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
                    </v-expansion-panels>
                </v-expand-transition>
            </v-card-text>
        </v-card>
    </v-card>
</template>
  

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { CreateContainerForm } from '@yacht/types';
import BaseInfo from './create/base.vue'
import NetworkInfo from './create/network.vue'
import Dynamic from './create/dynamic.vue'

const form: Ref<CreateContainerForm> = ref({
    name: '',
    image: '',
    info: {
        icon: '',
        title: '',
        notes: '',
    },
    env: [],
    mounts: [],
    command: [],
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
</script>
