<template>
    <v-card density="compact" class="v-card--reveal overflow-auto" style="height: 100%;">
        <v-toolbar :elevation="8" title="featured applications">
            <v-toolbar-items>
                <v-btn :rounded="0" variant="text" icon @click="$emit('close')"><v-icon icon="mdi-close" /></v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-list v-if="template.featured">
            <v-list-item lines="three" v-for="app in template.featured" :key="template.templates[app].title"
                :title="template.templates[app].title || template.templates[app].name"
                :prepend-avatar="template.templates[app].logo || null">
                <v-list-item-subtitle class="text-primary">{{ template.templates[app].image
                }}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="template.templates[app].description">{{ template.templates[app].description ||
                    null
                }}</v-list-item-subtitle>
            </v-list-item>
        </v-list>
        <v-list v-else>
            <v-list-item lines="three" v-for="app in template.templates.slice(0, 10)" :key="app.title"
                :title="app.title || app.name" :prepend-avatar="app.logo || null">
                <v-list-item-subtitle class="text-primary">{{ app.image
                }}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="app.description">{{ app.description || null
                }}</v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </v-card>
</template>
<script setup lang="ts">
import { YachtTemplate } from '@yacht/types';

interface Props {
    template: YachtTemplate,
}
defineProps<Props>()
defineEmits(['close'])
</script>