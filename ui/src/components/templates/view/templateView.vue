<template>
    <v-card class="overflow-auto">
        <search-bar :title="template.title || template.name" color="surface" v-model:search="searchQuery" />
        <v-sheet color="foreground">
            <v-container>
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