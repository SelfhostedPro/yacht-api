<template>
    <v-card-title v-if="props.info.title" tag="span">{{ props.info.title }}
        <v-btn v-if="props.info.url" size="small" icon target="_blank" variant="plain" :href="props.info.url">
            <v-icon icon="mdi-open-in-new" />
        </v-btn>
        <v-btn v-if="props.info.docs" size="small" icon target="_blank" variant="plain" :href="props.info.docs">
            <v-icon icon="mdi-file-document" />
        </v-btn>
        <v-btn v-if="props.info.source" size="small" icon target="_blank" variant="plain" :href="props.info.source">
            <v-icon icon="mdi-github" />
        </v-btn>
    </v-card-title>
    <v-card-subtitle v-if="props.info.vendor" tag="span" class="mt-0">created by: {{ props.info.vendor
    }}</v-card-subtitle>
    <v-card-text v-if="props.info.description"><vue-markdown :source="props.info.description" /></v-card-text>
</template>

<script setup lang="ts">
import VueMarkdown from '@/helpers/render/markdown.vue'
import { Container } from '@/types/apps';
interface Props {
    info: Container['info']
}
const props = defineProps<Props>()
</script>