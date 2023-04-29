<template>
    <v-card-title tag="span">{{ app.info.title }}
        <v-btn v-if="app.info.url" @click.stop size="small" icon target="_blank" variant="plain"
            :href="app.info.url">
            <v-icon icon="mdi-open-in-new" />
        </v-btn>
        <v-btn v-if="app.info.docs" @click.stop size="small" icon target="_blank" variant="plain"
            :href="app.info.docs">
            <v-icon icon="mdi-file-document" />
        </v-btn>
        <v-btn v-if="app.info.source" @click.stop size="small" icon target="_blank" variant="plain"
            :href="app.info.source">
            <v-icon icon="mdi-github" />
        </v-btn>
    </v-card-title>
    <v-card-subtitle v-if="app.info.vendor" tag="span" class="mt-0">created by: {{ app.info.vendor }}</v-card-subtitle>
    <v-card-text><vue-markdown v-if="app.info.description" :source="app.info.description" /></v-card-text>
</template>

<script setup lang="ts">
import { Container } from '@/types/apps';
import VueMarkdown from '@/helpers/render/markdown.vue'
interface Props {
    app: Container
}
defineProps<Props>()
</script>