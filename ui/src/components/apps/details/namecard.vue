<template>
    <v-card class="pb-2" :loading="isLoading.loading">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <v-toolbar v-if="app">
            <template v-slot:prepend>
                <v-btn class="my-2 mx-2" :icon="expand ? 'mdi-chevron-up' : 'mdi-chevron-down'" density="comfortable"
                    v-on:click="expand = !expand" />
                <v-divider />
                <v-avatar :image="app.info.icon || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'" />
            </template>
            <v-toolbar-title>
                <v-tooltip :text="app.status" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-avatar class="ml-1" v-bind="props" :color="app.status == 'running' ? 'primary' : 'red'"
                            size="6"></v-avatar>
                    </template>
                </v-tooltip>
                {{ ' ' + app.name }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn prepend-icon="mdi-help-circle-outline" color="info">
                help
            </v-btn>
            <v-btn prepend-icon="mdi-file-document-edit-outline" color="warning">
                edit
            </v-btn>
            <v-btn>
                <v-icon icon="mdi-console-line" />
            </v-btn>
            <v-btn @click="$emit('refresh')" variant="plain">
                <v-icon icon="mdi-refresh" />
            </v-btn>
        </v-toolbar>
        <v-expand-transition>
            <div v-show="expand">
                <v-list-item>
                    <v-list-item-title> image </v-list-item-title>
                    <v-list-item-subtitle>{{ app.image }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> id </v-list-item-title>
                    <v-list-item-subtitle>{{ app.id }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> status </v-list-item-title>
                    <v-list-item-subtitle>{{ app.status }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title> restart </v-list-item-title>
                    <v-list-item-subtitle>{{ app.restart && app.restart.policy ? app.restart.policy : '-' }}</v-list-item-subtitle>
                </v-list-item>
                <v-divider v-if="app.info.title" />
            </div>
        </v-expand-transition>
        <v-expand-transition>
            <div v-if="props.app.info.title">
                <ocilabels :info="app.info" />
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@/types/apps';
import ocilabels from "@/components/apps/details/ocilabels.vue"
import { ref } from 'vue';
import { useLoadingStore } from '@/stores/loading';
import { storeToRefs } from 'pinia';

defineEmits(['refresh'])

const loading = ref(true)
const loadingStore = useLoadingStore()
const {isLoading} = storeToRefs(loadingStore)

loading.value = isLoading.value.loading

interface Props {
    app: Container
}
const props = defineProps<Props>()
const expand = ref(true)
</script>