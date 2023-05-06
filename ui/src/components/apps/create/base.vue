<template>
    <v-toolbar color="surface" dark>
        <v-toolbar-title class="text-center">info</v-toolbar-title>
        <v-toolbar-items>
            <v-tooltip text="preview">
                <template v-slot:activator="{ props }">
                    <v-btn @click="infoPreview = !infoPreview" v-bind="props" variant="text" icon="mdi-file-code-outline" />
                </template>
            </v-tooltip>
        </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
        <v-row>
            <v-col :cols="!mdAndDown == true ? 6 : 12">
                <v-text-field label="name" v-model="modelValue.name" placeholder="My Container" required></v-text-field>
                <v-text-field label="image" v-model="modelValue.image" placeholder="image:my-image" required></v-text-field>
                <v-select :items="['always', 'on-failure', 'unless-stopped', 'none']" v-model="modelValue.restart"
                    label="restart policy" required></v-select>
            </v-col>
            <v-divider :vertical="!mdAndDown"></v-divider>
            <v-col v-if="infoPreview === true" :cols="!mdAndDown == true ? 6 : 12">
                <v-row>
                    <v-col cols="2">
                        <v-avatar size="60" :image="modelValue.info.icon || defaultPreview.icon"></v-avatar>
                    </v-col>
                    <v-col>
                        <v-card-title>{{ modelValue.info.title || defaultPreview.title }}</v-card-title>
                        <v-card-text><vue-markdown :source="modelValue.info.notes || defaultPreview.notes" /></v-card-text>
                    </v-col>
                </v-row>
                <v-card-text class="font-weight-black">DO NOT STORE SENSITIVE INFO HERE OR R/SELFHOSTED WILL JUDGE YOU
                    😤</v-card-text>
            </v-col>
            <v-col v-else :cols="!mdAndDown == true ? 6 : 12">
                <v-row>
                    <v-col cols="2">
                        <v-avatar size="60"
                            :image="modelValue.info.icon || 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png'"></v-avatar>
                    </v-col>
                    <v-col>
                        <v-text-field label="icon" v-model="modelValue.info.icon"
                            placeholder="https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png" />
                    </v-col>
                </v-row>
                <v-text-field label="title" v-model="modelValue.info.title" placeholder="My Container" required />
                <v-textarea label="notes" auto-grow :placeholder="defaultPreview.notes" v-model="modelValue.info.notes" />
            </v-col>

        </v-row>
    </v-card-text>
</template>

<script setup lang="ts">
import { CreateContainerForm } from '@yacht/types';
import VueMarkdown from '@/helpers/render/markdown.vue'
import { useDisplay } from 'vuetify';
import { ref } from 'vue';
const infoPreview = ref(false)
const defaultPreview = {
    icon: 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png',
    title: 'My Container',
    notes: '## Notes\n Some notes about this section: \n\n - *Markdown is supported* \n\n - [links](https://yacht.sh) are super easy to add \n\n - The container will need to be restarted to edit this (limitation of docker)',
}
interface Props {
    modelValue: CreateContainerForm
}
defineProps<Props>()
defineEmits(['update:modelValue'])
const { mdAndDown } = useDisplay()
</script>