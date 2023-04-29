<template>
    <v-card :loading="isLoading.loading">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <searchbar v-model:search="searchQuery" />
        <v-sheet color="foreground">
            <v-container>
                <v-row dense>
                    <v-fade-transition v-if="appSearch || apps" group>
                        <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="app in appSearch" :key="app.shortId">
                            <v-card :to="'/apps/' + app.name" class="pa-1 pb-1" density="compact">
                                <v-row dense no-gutters class="align-start">
                                    <v-col>
                                        <baseinfo :app="app" />
                                        <v-btn :icon="revealActions[app.shortId] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                            variant="text" color="primary"
                                            v-on:click.prevent="revealActions[app.shortId] = !revealActions[app.shortId]">
                                        </v-btn>
                                        <v-btn v-if="app.mounts[0] || app.ports && app.ports[0] || app.info"
                                            :icon="revealResources[app.shortId] ? 'mdi-information-off' : 'mdi-information'"
                                            variant="text" color="primary"
                                            v-on:click.prevent="revealResources[app.shortId] = !revealResources[app.shortId]">
                                        </v-btn>
                                        <Suspense>
                                            <iconstats v-if="stats[app.name] && app.status === 'running'"
                                                :stats="stats[app.name]" :app="app" :loading="!isLoading.loading" />
                                        </Suspense>
                                    </v-col>
                                </v-row>
                                <actions :app="app" :reveal="revealActions[app.shortId]" />
                                <Suspense>
                                    <resourcetab :app="app" :reveal="revealResources[app.shortId]" />
                                </Suspense>
                            </v-card>
                        </v-col>
                    </v-fade-transition>
                </v-row>
            </v-container>
        </v-sheet>
    </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/apps'
import { ref, computed, Ref, ComputedRef } from 'vue';
// Import custom components
import searchbar from '@/components/apps/info/search.vue'
import baseinfo from '@/components/apps/info/base.vue'
import resourcetab from '@/components/apps/info/resourcetab.vue'
import actions from '@/components/apps/info/actions.vue'
import iconstats from '@/components/apps/info/stats.vue'
// Import store utilities
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useLoadingStore } from '@/stores/loading';
import { Container } from '@/types/apps';
// Card expansion variables
const revealActions = ref({})
const revealResources = ref({})
// Store variables
const loading = ref(true)
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
const appStore = useAppStore()
const { apps, stats } = storeToRefs(appStore)
// Initialize Search Variable
const searchQuery: Ref<string> = ref('')
// Filter apps by search variable
const appSearch: ComputedRef<Container[]> = computed(() => {
    const searchQueryLowerCase = searchQuery.value.toLowerCase();
    return apps.value.filter((app) => {
        // These fields are strings
        const stringFields = [
            app.name,
            app.id,
            app.image,
            app.shortId,
            app.status,
            app.state,
            app.info.title,
            app.info.vendor
        ];
        // These fields are an array of strings based on the values of each of the objects in the array's properties
        const arrayFields = [app.mounts.map((mount) => mount.source), app.ports.map((port) => port.hostPort)];
        // Matching filters
        const stringMatch = stringFields.some((field) => field?.toLowerCase().includes(searchQueryLowerCase));
        const arrayMatch = arrayFields.some((fieldArray) => fieldArray.some((field) => field?.toString().toLowerCase().includes(searchQueryLowerCase)));
        return stringMatch || arrayMatch;
    });
});
// Fetch Apps
onMounted(async () => {
    loading.value = isLoading.value.loading
    if (!apps.value[0] || !stats.value[0]) {
        appStore.fetchApps()
        appStore.fetchStats()
    }
})
</script>
<style>
.v-app-bar-title__content {
    display: flex;
}
</style>