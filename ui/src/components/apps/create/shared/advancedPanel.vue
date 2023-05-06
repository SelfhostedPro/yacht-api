<template>
    <v-card-title class="text-center"> {{ name }} </v-card-title>
    <v-card-text>
        <v-slide-x-transition group>
            <v-row align="center" no-gutters class="my-2" v-for="resource, i in resources" :key="i">
                <v-col cols="11">
                    <v-card>
                        <v-card-text>
                            <v-row :dense="mdAndDown" align="center">
                                <v-col cols="6">
                                    <v-text-field label="" placeholder="PUID" v-model="resource['key']"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field label="value" placeholder="1000" v-model="resource['value']"
                                        hide-details="auto"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col class="text-center" cols="1">
                    <v-btn icon variant="plain" @click="delAdv(i)" class="mx-auto"><v-icon icon="mdi-minus" /></v-btn>
                </v-col>
            </v-row>
        </v-slide-x-transition>
    </v-card-text>
    <addbutton :resources="resources" :name="name" @add="addAdv()" />
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { defineProps } from 'vue';
import addbutton from './addButton.vue'
import { CreateContainerForm } from '@yacht/types';
const { mdAndDown } = useDisplay()
interface Props {
    name: string
    type: CreateContainerForm['command'] | CreateContainerForm['sysctls'] | CreateContainerForm['devices'] | CreateContainerForm['cap_add'] | CreateContainerForm['cap_drop']
    resources: any
}
const props = defineProps<Props>()
const delAdv = (idx: number) => {
    props.resources.splice(idx, 1)
}
const addAdv = () => {
    props.resources.push({
        key: '',
        value: '',
    })
}
</script>