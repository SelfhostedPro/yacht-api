<template>
    <v-card-title tag="span">{{ ociInfo.title }}
        <v-btn v-if="ociInfo.url" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
            :href="ociInfo.url">
            <v-icon icon="mdi-open-in-new" />
        </v-btn>
        <v-btn v-if="ociInfo.docs" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
            :href="ociInfo.docs">
            <v-icon icon="mdi-file-document" />
        </v-btn>
        <v-btn v-if="ociInfo.source" @click.native.capture.stop size="small" icon target="_blank" variant="plain"
            :href="ociInfo.source">
            <v-icon icon="mdi-github" />
        </v-btn>
    </v-card-title>
    <v-card-subtitle v-if="ociInfo.vendor" tag="span" class="mt-0">created by: {{ ociInfo.vendor }}</v-card-subtitle>
    <v-card-text><vue-markdown v-if="ociInfo.description" :source="ociInfo.description" /></v-card-text>
</template>

<script setup lang="ts">
import { ReadableContainerInfo } from '@/types/apps';
import VueMarkdown from '@/helpers/render/markdown.vue'
import { ref } from 'vue';
interface Props {
    app: ReadableContainerInfo
}
interface OciInfo {
    title: string,
    description?: string,
    docs?: string,
    url?: string,
    source?: string,
    vendor?: string
}
const props = defineProps<Props>()

const ociInfo = ref<OciInfo>({
    title: props.app.Labels['org.opencontainers.image.title'] || props.app.ShortName,
    description: props.app.Labels['org.opencontainers.image.description'] || null,
    docs: props.app.Labels['org.opencontainers.image.documentation'] || null,
    url: props.app.Labels['org.opencontainers.image.url'] || props.app.Labels['com.docker.extension.publisher-url'] || null,
    source: props.app.Labels['org.opencontainers.image.source'] || null,
    vendor: props.app.Labels['org.opencontainers.image.vendor']
})
</script>