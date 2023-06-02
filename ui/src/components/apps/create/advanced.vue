<template>
    <v-card color="foreground">
        <v-card-text>
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
                            <p style="white-space:pre-wrap;">{{ modelValue }}</p>
                        </v-card>
                        <v-card title="template">
                            <p style="white-space:pre-wrap;">{{ template }}</p>
                        </v-card>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
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
</script>