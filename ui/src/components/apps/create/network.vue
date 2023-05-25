<template>
    <v-card :rounded="0" color="foreground">
        <v-toolbar :rounded="0" color="surface">
            <v-toolbar-title class="text-center"> network </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-slide-x-transition>
                <v-select clearable v-show="!modelValue.network_mode" :items="networks[modelValue.server]" item-title="Name"
                    item-value="Name" label="network" v-model="modelValue.network" required></v-select>
            </v-slide-x-transition>
            <v-slide-x-transition>
                <v-select clearable v-show="!modelValue.network" :items="['bridge', 'host', 'none']" label="network mode"
                    v-model="modelValue.network_mode" required></v-select>
            </v-slide-x-transition>
            <v-slide-x-transition group>
                <v-row align="center" no-gutters class="my-2"
                    v-if="modelValue.network_mode === 'bridge' || modelValue.network === 'bridge'"
                    v-for="port, i in modelValue.ports" :key="i">
                    <v-col :cols="formCols('card')">
                        <v-card>
                            <v-card-text>
                                <v-row align="center">
                                    <v-col :cols="formCols('label')">
                                        <v-text-field label="label" placeholder="webui" v-model="port.label"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('host')">
                                        <v-text-field :disabled="Array.isArray(port.unchangable) && port.unchangable.includes('host') || port.unchangable === true" label="host" placeholder="8080" v-model="port.host"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('container')">
                                        <v-text-field :disabled="Array.isArray(port.unchangable) && port.unchangable.includes('container') || port.unchangable === true" label="container" placeholder="80" v-model="port.container"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('protocol')">
                                        <v-select :disabled="Array.isArray(port.unchangable) && port.unchangable.includes('protocol') || port.unchangable === true" label="protocol" :items="['udp', 'tcp']" v-model="port.protocol"
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
        <addbutton v-if="modelValue.network_mode === 'bridge' || modelValue.network === 'bridge'"
            :resources="modelValue.ports" name="port" @add="addPort()" />
    </v-card>
</template>

<script setup lang="ts">
// @ts-nocheck
import { CreateContainerForm, ServerNetworks } from '@yacht/types'
import { useDisplay } from 'vuetify';
import addbutton from './shared/addButton.vue'
interface Props {
    modelValue: CreateContainerForm,
    networks: ServerNetworks
}
const props = defineProps<Props>()
defineEmits(['update:modelValue'])
const { smAndDown } = useDisplay()
// const ports: Ref<ContainerFormPorts[]> = ref([] as ContainerFormPorts[])
const delPort = (idx: number) => {
    props.modelValue.ports.splice(idx, 1)
}
const addPort = () => {
    props.modelValue.ports.push({
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
</script>