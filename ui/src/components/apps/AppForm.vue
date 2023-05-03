<template>
    <v-container>
        <v-card>
            <BaseInfo></BaseInfo>
            <v-window v-model="currentWindow">
                <v-window-item :value="0">
                    <NetworkInfo></NetworkInfo>
                </v-window-item>
                <v-window-item :value="1">
                    <VolumeInfo></VolumeInfo>
                </v-window-item>
                <v-window-item>

                </v-window-item>
                <v-window-item>

                </v-window-item>
            </v-window>
            <v-card-actions>
                <v-spacer />
                <v-btn v-if="!(currentWindow === 0)" @click="prev">Previous</v-btn>
                <v-btn @click="next">Next</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
  

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { CreateContainerForm } from '@yacht/types';
import { ContainerCreateOptions } from 'dockerode'
import BaseInfo from './create/base.vue'
import NetworkInfo from './create/network.vue'
import VolumeInfo from './create/volumes.vue'

const form: Ref<CreateContainerForm> = ref({} as CreateContainerForm)
const currentWindow = ref(0)

const next = () => {
    return currentWindow.value += 1
}
const prev = () => {
    return currentWindow.value -= 1
}
</script>
  