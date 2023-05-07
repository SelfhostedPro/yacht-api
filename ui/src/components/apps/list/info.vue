<template>
    <v-card-title tag="span">{{ app.info.title }}
        <v-btn v-if="app.info.url" @click.stop size="small" icon target="_blank" variant="plain" :href="app.info.url">
            <v-icon icon="mdi-open-in-new" />
        </v-btn>
        <v-btn v-if="app.info.docs" @click.stop size="small" icon target="_blank" variant="plain" :href="app.info.docs">
            <v-icon icon="mdi-file-document" />
        </v-btn>
        <v-btn v-if="app.info.source" @click.stop size="small" icon target="_blank" variant="plain" :href="app.info.source">
            <v-icon icon="mdi-github" />
        </v-btn>
    </v-card-title>
    <v-card-subtitle v-if="app.info.vendor" tag="span" class="mt-0">created by: {{ app.info.vendor }}</v-card-subtitle>
    <v-card-text v-if="app.info.description"><vue-markdown :source="app.info.description" /></v-card-text>
    <v-card color="info" v-if="app.info['notes'] && app.info.notes.length !== 0">
        <v-card-item prepend-icon="mdi-information-outline"><vue-markdown :source="app.info.notes" /> </v-card-item>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@yacht/types';
import VueMarkdown from '@/helpers/render/markdown.vue'
interface Props {
    app: Container
}
defineProps<Props>()
</script>