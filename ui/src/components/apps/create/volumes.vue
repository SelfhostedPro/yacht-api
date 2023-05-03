<template>
    <v-card color="foreground">
        <v-card-title class="text-center"> storage </v-card-title>
        <v-card-text>
            <v-slide-x-transition group>
                <v-row align="center" no-gutters class="my-2" v-for="volume, i in volumes" :key="i">
                    <v-col cols="11">
                        <v-card>
                            <v-card-text>
                                <v-row :dense="mdAndDown" align="center">
                                    <v-col :cols="formCols('label')">
                                        <v-text-field label="label" placeholder="webui" v-model="volume.label"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('source')">
                                        <v-text-field label="source" placeholder="8080" v-model="volume.source"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('destination')">
                                        <v-text-field label="destination" placeholder="80" v-model="volume.destination"
                                            hide-details="auto"></v-text-field>
                                    </v-col>
                                    <v-col :cols="formCols('readonly')" class="text-center">
                                        <v-btn
                                            color="secondary"
                                            :block="mdAndDown"
                                            :icon="mdAndDown"
                                            rounded="lg"
                                            :variant="volume.read_only ? 'flat' : 'outlined'"
                                            @click="volume.read_only = !volume.read_only"> <v-icon :icon="volume.read_only ? 'mdi-lock' : 'mdi-lock-open'" /> {{ mdAndDown ? null : 'read only' }} </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col class="text-center" cols="1">
                        <v-btn icon variant="plain" @click="delVolume(i)" class="mx-auto"><v-icon
                                icon="mdi-minus" /></v-btn>
                    </v-col>
                </v-row>
            </v-slide-x-transition>
        </v-card-text>
        <v-btn @click="addVolume()" :color="volumes.length === 0 ? 'warning' : 'surface'" size="x-large" flat rounded="0" class="float-right"><v-icon icon="mdi-plus" /></v-btn>
    </v-card>
</template>

<script setup lang="ts">
import { ContainerFormVolumes } from '@yacht/types'
import { Ref, ref } from 'vue';
import { useDisplay } from 'vuetify';
const { smAndDown, mdAndDown } = useDisplay()
const volumes: Ref<ContainerFormVolumes[]> = ref([] as ContainerFormVolumes[])
const delVolume = (idx: number) => {
    volumes.value.splice(idx, 1)
}
const addVolume = () => {
    volumes.value.push({
        label: '',
        source: '',
        destination: '',
        read_only: false
    })
}

const formCols = (field: 'label' | 'source' | 'destination' | 'readonly') => {
    const cols = {
        label: { sm: '12', other: '2' },
        source: { sm: '12', other: '4' },
        destination: { sm: '9', other: '4' },
        readonly: { sm: '3', other: '2' },
    };
    return smAndDown.value === true ? cols[field].sm : cols[field].other;
};
</script>