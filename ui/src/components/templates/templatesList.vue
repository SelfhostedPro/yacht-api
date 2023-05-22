<template>
    <v-card :loading="isLoading.loading || loading">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <topbar />
        <v-sheet color="foreground">
            <v-fade-transition v-if="isLoading.items.get('templates')">
                <v-window>
                    <v-row dense>
                        <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="i in 12">
                            <v-skeleton-loader class="pa-1 pb-1" type="card" />
                        </v-col>
                    </v-row>
                </v-window>
            </v-fade-transition>
            <v-fade-transition v-else-if="templates">
                <v-container>
                    <v-row dense>
                        <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="template in templates"
                            :key="template.name">
                            <v-card max-height="350" density="compact">
                                <v-img :src="template.image || storePlaceholderImage" height="200" cover />
                                <v-card-title>{{ template.title }}
                                </v-card-title>
                                <v-card-subtitle> {{ template.url.replace('https://raw.githubusercontent.com/', '') }}
                                </v-card-subtitle>
                                <v-card-subtitle>type: {{ template.type }}</v-card-subtitle>
                                <v-card-subtitle> created: {{ template.created }}</v-card-subtitle>
                                <v-card-subtitle> apps: {{ Object.keys(template.templates).length }}</v-card-subtitle>
                                <v-card-actions>
                                    <v-dialog :fullscreen="maximize" transition="dialog-bottom-transition">
                                        <template v-slot:activator="{ props }">
                                            <v-btn color="primary" v-bind="props">view</v-btn>
                                        </template>
                                        <template v-slot:default="{ isActive }">
                                            <v-card>
                                                <template-view :template="template" @maximize="maximize = !maximize" @close="isActive.value = false" />
                                            </v-card>
                                        </template>
                                    </v-dialog>
                                    <v-btn @click="featuredReveal[template.title] = true">featured<v-icon
                                            :icon="featuredReveal[template.title] ? 'mdi-chevron-up' : 'mdi-chevron-down'" /></v-btn>
                                    <v-spacer />
                                    <authors v-if="template.authors" :authors="template.authors" />
                                </v-card-actions>
                                <v-expand-transition>
                                    <featured v-show="featuredReveal[template.title]" :template="template"
                                        @close="featuredReveal[template.title] = false" />
                                </v-expand-transition>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-fade-transition>
        </v-sheet>
    </v-card>
</template>
<script setup lang="ts">
import topbar from './list/topbar.vue';
import featured from './list/featured.vue';
import templateView from './view/templateView.vue';
import authors from './list/authors.vue';
import storePlaceholderImage from '@/assets/store-placeholder.jpg';
import { useLoadingStore } from '@/stores/loading';
import { useTemplateStore } from '@/stores/templates';
import { YachtTemplate } from '@yacht/types';
import { storeToRefs } from 'pinia';
import { onMounted, ref, Ref } from 'vue';
const maximize = ref(false)
const featuredReveal = ref({})
const loadingStore = useLoadingStore();
const templateStore = useTemplateStore();
const templates: Ref<YachtTemplate[]> = storeToRefs(templateStore).templates
const { isLoading } = storeToRefs(loadingStore)
const loading = ref(true)

onMounted(async () => {
    loading.value = isLoading.value.loading
    await templateStore.fetchTemplates()
})
</script>
<style>
.v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
}
</style>