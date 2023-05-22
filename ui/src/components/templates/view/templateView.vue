<template>
    <v-card class="overflow-auto">
        <search-bar :title="template.title || template.name" color="surface" v-model:search="searchQuery" />
        <v-sheet color="foreground">
            <v-container>
                <v-row dense>
                    <v-col>
                        <v-carousel show-arrows="hover" height="400" hide-delimiters progress="primary">
                            <v-carousel-item v-for="app in template.featured" :key="template.templates[app].title">
                                <v-card class="text-center fill-height">
                                    <v-img class="d-flex align-end featured-image"
                                        :src="template.templates[app]['featured_image'] ? template.templates[app]['featured_image'] : template.templates[app].logo"
                                        cover>
                                        <v-card :rounded="0" class="featured-card" flat>
                                            <v-card-title class="text-high-emphasis">{{ template.templates[app].title ||
                                                template.templates[app].name
                                            }}</v-card-title>
                                            <v-card-text class="text-high-emphasis"
                                                v-if="template.templates[app].description">{{
                                                    template.templates[app].description }}</v-card-text>
                                        </v-card>
                                    </v-img>
                                </v-card>
                            </v-carousel-item>
                        </v-carousel>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col class="text-center">
                        <v-card>
                            <v-card-text class="text-high-emphasis">{{ template.description }}</v-card-text>
                            <v-card-subtitle>type: {{ template.type }}</v-card-subtitle>
                            <v-card-subtitle>created: {{ template.created }}</v-card-subtitle>
                            <v-card-subtitle>apps: {{ template.templates.length }}</v-card-subtitle>
                            <v-card-actions class="flex-d justify-center">
                                <v-btn v-for="link in template.links" :color="link.color || null" :key="link.text" :prepend-icon="link.icon || 'mdi-link'" :href="link.url || null" target="_blank">{{ link.text || 'link' }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="app in templateSearch(template.templates)"
                        :key="app.title">
                        <v-card class="overflow-auto" min-height="200" max-height="200">
                            <v-card-item :prepend-avatar="app.logo" :title="app.title || app.name">
                                <v-card-subtitle class="text-primary" color="primary">{{ app.image }}</v-card-subtitle>
                            </v-card-item>
                            <v-card-text>{{ app.description || `${app.title || app.name} doesn't provide a
                                description.`}}</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <pre>{{ template }}</pre>
        </v-sheet>
    </v-card>
</template>

<script setup lang="ts">
import SearchBar from '@/components/common/SearchBar.vue';
import { Ref, ref } from 'vue';
import { YachtTemplate } from '@yacht/types'
interface Props {
    template: YachtTemplate
}
defineProps<Props>()
defineEmits(['close', 'maximize'])

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
        const arrayFields = [app.labels?.map((label) => label.name), app.environment?.map((env) => env.name), app.categories?.map((category) => category)];
        // Matching filters
        const stringMatch = stringFields?.some((field) => field?.toLowerCase().includes(searchQueryLowerCase));
        const arrayMatch = arrayFields?.some((fieldArray) => fieldArray?.some((field) => field?.toString().toLowerCase().includes(searchQueryLowerCase)));
        return stringMatch || arrayMatch
    });
};
</script>

<style>
.featured-card {
    background: linear-gradient(0deg, rgba(33, 33, 33, 0.9) 0%, rgba(33, 33, 33, 0.9) 10%, rgba(33, 33, 33, 0.9) 90%, rgba(33, 33, 33, 0.9) 100%);
    backdrop-filter: blur(5px) brightness(40%);
}
</style>