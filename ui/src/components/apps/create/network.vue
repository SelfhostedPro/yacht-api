<template>
    <v-card flat color="foreground">
        <v-card-text>
            <v-card :rounded="0" color="surface">
                <v-card-text>
                    <v-slide-x-transition>
                        <v-select clearable v-show="!modelValue.network_mode" :items="networks[modelValue.server]"
                            item-title="Name" item-value="Name" label="network" v-model="modelValue.network"
                            hide-details="auto" :class="!modelValue.network ? 'mb-5' : undefined" />
                    </v-slide-x-transition>
                    <v-slide-x-transition>
                        <v-select clearable v-show="!modelValue.network" :items="['bridge', 'host', 'none']"
                            label="network mode" v-model="modelValue.network_mode" hide-details="auto" />
                    </v-slide-x-transition>
                </v-card-text>
            </v-card>
            <Dynamic title="ports" name="ports" :use-card="true" v-model="modelValue.ports" />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
// @ts-nocheck
import { CreateContainerForm, ServerNetworks } from '@yacht/types'
import { useDisplay } from 'vuetify';
import Dynamic from './dynamic.vue';

interface Props {
    modelValue: CreateContainerForm,
    networks: ServerNetworks
}
defineProps<Props>()
defineEmits(['update:modelValue'])
useDisplay()


</script>