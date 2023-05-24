<template>
    <v-card :loading="isLoading.loading || loading">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <search-bar :title="'templates'" color="surface" v-model:search="searchQuery" />
        <v-tabs align-tabs="center" v-model="tab" color="primary" slider-color="primary" >
            <v-tab v-for="template, i in templates" :key="template.name" :value="i">{{ template.title }}</v-tab>
        </v-tabs>
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
                <v-window v-model="tab">
                    <v-window-item v-for="template,i in templates" :value="i">
                        <template-view :template="template" :templates="templateSearch(template.templates)" :searchQuery="searchQuery" />
                    </v-window-item>
                </v-window>
            </v-fade-transition>
        </v-sheet>
    </v-card>
</template>
<script setup lang="ts">
import SearchBar from '@/components/common/SearchBar.vue';
import templateView from './view/templateView.vue';
import { useLoadingStore } from '@/stores/loading';
import { useTemplateStore } from '@/stores/templates';
import { YachtTemplate } from '@yacht/types';
import { storeToRefs } from 'pinia';
import { onMounted, ref, Ref } from 'vue';
const tab = ref(0)
const loadingStore = useLoadingStore();
const templateStore = useTemplateStore();
const templates: Ref<YachtTemplate[]> = storeToRefs(templateStore).templates
const { isLoading } = storeToRefs(loadingStore)
const loading = ref(true)

onMounted(async () => {
    loading.value = isLoading.value.loading
    await templateStore.fetchTemplates()
})

// Initialize Search Variable
const searchQuery: Ref<string> = ref('')
// Filter apps by search variable
const templateSearch = (templateList: YachtTemplate['templates']) => {
    const searchQueryLowerCase = searchQuery.value.toLowerCase();
    return templateList.filter((app) => {
        // These fields are strings
        const stringFields = [
            app.name,
            app.image,
            app.description,
            app.title,
            app.note
        ];
        // These fields are an array of strings based on the values of each of the objects in the array's properties
        const arrayFields = [app.labels?.map((label) => label.key), app.env?.map((env) => env.name), app.categories?.map((category) => category)];
        // Matching filters
        const stringMatch = stringFields?.some((field) => field?.toLowerCase().includes(searchQueryLowerCase));
        const arrayMatch = arrayFields?.some((fieldArray) => fieldArray?.some((field) => field?.toString().toLowerCase().includes(searchQueryLowerCase)));
        return stringMatch || arrayMatch
    });
};

</script>
<style>
.v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
}
</style>