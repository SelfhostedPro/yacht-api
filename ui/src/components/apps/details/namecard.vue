<template>
    <v-card class="pb-2">
        <v-toolbar v-if="app">
            <template v-slot:prepend>
                <v-btn class="my-2 mx-2" :icon="expand ? 'mdi-chevron-up' : 'mdi-chevron-down'" density="comfortable"
                    v-on:click="expand = !expand" />
                <v-divider />
                <v-avatar image="https://cdn.vuetifyjs.com/images/cards/halcyon.png" />
            </template>
            <v-toolbar-title>
                <v-tooltip :text="app.status" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-avatar class="ml-1" v-bind="props" :color="app.status == 'running' ? 'primary' : 'red'"
                            size="6"></v-avatar>
                    </template>
                </v-tooltip>
                {{ ' ' + app['ShortName'] }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn class="mx-1" prepend-icon="mdi-help-circle-outline" color="info">
                help
            </v-btn>
            <v-btn prepend-icon="mdi-file-document-edit-outline" color="warning">
                edit
            </v-btn>
            <v-btn variant="plain" class="mx-1">
                <v-icon icon="mdi-refresh" />
            </v-btn>
        </v-toolbar>
        <v-expand-transition>
            <div v-show="expand">
                <v-list-item>
                    <v-list-item-title> image </v-list-item-title>
                    <v-list-item-subtitle>{{ app.image }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> id </v-list-item-title>
                    <v-list-item-subtitle>{{ app.id }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> status </v-list-item-title>
                    <v-list-item-subtitle>{{ app.status }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> restart </v-list-item-title>
                    <v-list-item-subtitle>{{ app.restart.policy }}</v-list-item-subtitle>
                </v-list-item>
                <v-divider />
            </div>
        </v-expand-transition>
        <v-card-title tag="span">{{ props.app.info.title }}
            <v-btn v-if="props.app.info.url" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
                :href="props.app.info.url">
                <v-icon icon="mdi-open-in-new" />
            </v-btn>
            <v-btn v-if="props.app.info.docs" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
                :href="props.app.info.docs">
                <v-icon icon="mdi-file-document" />
            </v-btn>
            <v-btn v-if="props.app.info.source" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
                :href="props.app.info.source">
                <v-icon icon="mdi-github" />
            </v-btn>
        </v-card-title>
        <v-card-subtitle v-if="props.app.info.vendor" tag="span" class="mt-0">created by: {{ props.app.info.vendor
        }}</v-card-subtitle>
        <v-card-text><vue-markdown v-if="props.app.info.description" :source="props.app.info.description" /></v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@/types/apps';
import { ref } from 'vue';
import VueMarkdown from '@/helpers/render/markdown.vue'

interface Props {
    app: Container
}
const props = defineProps<Props>()
const expand = ref(true)
</script>