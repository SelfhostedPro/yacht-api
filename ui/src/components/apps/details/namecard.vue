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
                <v-tooltip :text="app.State.Status" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-avatar class="ml-1" v-bind="props" :color="app.State.Status == 'running' ? 'primary' : 'red'"
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
                    <v-list-item-subtitle>{{ app.Config.Image }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> id </v-list-item-title>
                    <v-list-item-subtitle>{{ app.Id }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> status </v-list-item-title>
                    <v-list-item-subtitle>{{ app.State.Status }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> restart </v-list-item-title>
                    <v-list-item-subtitle>{{ app.HostConfig.RestartPolicy.Name }}</v-list-item-subtitle>
                </v-list-item>
                <v-divider />
            </div>
        </v-expand-transition>
        <v-card-title tag="span">{{ props.ociInfo.title }}
            <v-btn v-if="props.ociInfo.url" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
                :href="props.ociInfo.url">
                <v-icon icon="mdi-open-in-new" />
            </v-btn>
            <v-btn v-if="props.ociInfo.docs" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
                :href="props.ociInfo.docs">
                <v-icon icon="mdi-file-document" />
            </v-btn>
            <v-btn v-if="props.ociInfo.source" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
                :href="props.ociInfo.source">
                <v-icon icon="mdi-github" />
            </v-btn>
        </v-card-title>
        <v-card-subtitle v-if="props.ociInfo.vendor" tag="span" class="mt-0">created by: {{ props.ociInfo.vendor
        }}</v-card-subtitle>
        <v-card-text><vue-markdown v-if="props.ociInfo.description" :source="props.ociInfo.description" /></v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { OciInfo, ReadableContainerDetails } from '@/types/apps';
import { onMounted, ref } from 'vue';
import VueMarkdown from '@/helpers/render/markdown.vue'

interface Props {
    app: ReadableContainerDetails,
    ociInfo: OciInfo
}
const props = defineProps<Props>()
const expand = ref(true)
</script>