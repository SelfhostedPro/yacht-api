<template>
    <v-toolbar @click="expand = !expand" color="surface" dark>
        <v-row>
            <v-col cols="1">
            </v-col>
            <v-col>
                <v-toolbar-title class="text-center">advanced</v-toolbar-title>
            </v-col>
            <v-col cols="1">
                <v-toolbar-items class="float-right">
                    <v-icon :icon="expand ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                </v-toolbar-items>
            </v-col>
        </v-row>
    </v-toolbar>
    <v-card class="overflow-auto" color="foreground">
        <v-expand-transition v-show="expand === true">
            <v-expansion-panels color="surface">
                <Dynamic name="command" advanced v-model="modelValue.command" />
                <Dynamic name="labels" advanced v-model="modelValue.labels" />
                <Dynamic name="sysctls" advanced v-model="modelValue.sysctls" />
                <Dynamic name="devices" advanced v-model="modelValue.devices" />
                <Dynamic name="capabilities" advanced v-model="modelValue.capabilities" />
                <Dynamic name="limits" advanced v-model="modelValue.limits" />
                <v-expansion-panel title="raw">
                    <v-expansion-panel-text>
                        <v-card title="form">
                            <pre>{{ modelValue }}</pre>
                        </v-card>
                        <v-card title="template">
                            <pre>{{ template }}</pre>
                        </v-card>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-expand-transition>
    </v-card>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import Dynamic from './dynamic.vue'
import { CreateContainerForm, YachtTemplate } from '@yacht/types';
interface Props {
    modelValue: CreateContainerForm,
    template: YachtTemplate
}
defineProps<Props>()
defineEmits(['update:modelValue'])
const expand: Ref<boolean> = ref(false)
</script>