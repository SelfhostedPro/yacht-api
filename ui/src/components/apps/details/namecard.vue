<template>
    <v-card class="pb-2" :loading="isLoading.loading">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <v-toolbar v-if="app">
            <template v-slot:prepend>
                <v-avatar :image="app.info.icon || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'" />
            </template>
            <template v-slot:extension>
                <actioncard @action="handleAction" :app="app" />
                <v-spacer />
                <v-btn :rounded="0" :icon="mdAndDown" color="info">
                    <template v-if="!mdAndDown" v-slot:prepend>
                        <v-icon icon="mdi-help-circle-outline" />
                    </template>
                    <v-icon v-if="mdAndDown" icon="mdi-help-circle-outline" />
                    {{ !mdAndDown ? 'help' : null }}
                </v-btn>
                <v-btn :rounded="0" :icon="mdAndDown ? 'mdi-file-document-edit-outline' : null" color="warning">
                    <template v-if="!mdAndDown" v-slot:prepend>
                        <v-icon icon="mdi-file-document-edit-outline" />
                    </template>
                    <v-icon v-if="mdAndDown" icon="mdi-file-document-edit-outline" />
                    {{ !mdAndDown ? 'edit' : null }}
                </v-btn>
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
            <v-btn :rounded="0" variant="text" icon>
                <v-icon icon="mdi-console-line" />
            </v-btn>
            <v-btn :rounded="0" @click="$emit('refresh')" variant="text" icon="mdi-refresh" />
        </v-toolbar>
        <v-row>
            <v-col :cols="mdAndDown ? 12 : 6">
                <ocilabels :info="app.info" />
            </v-col>
            <v-divider v-if="Object.keys(app.info).length !== 1" :class="!mdAndDown ? 'mt-4' : null"
                :vertical="!mdAndDown" />
            <v-col :cols="!mdAndDown && Object.keys(app.info).length !== 1 ? 6 : 12">
                <v-list-item>
                    {{ Object.keys(app.info).length }}
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
                    <v-list-item-subtitle>{{ app.restart && app.restart.policy ? app.restart.policy : '-'
                    }}</v-list-item-subtitle>
                </v-list-item>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@yacht/types';
import ocilabels from "@/components/apps/details/ocilabels.vue"
import actioncard from './actioncard.vue';
import { ref } from 'vue';
import { useLoadingStore } from '@/stores/loading';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';

const { mdAndDown } = useDisplay()

const emit = defineEmits(['refresh', 'action'])

const loading = ref(true)
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)

loading.value = isLoading.value.loading

interface Props {
    app: Container
}
const props = defineProps<Props>()
const handleAction = (action) => {
    emit('action', action)
}
</script>