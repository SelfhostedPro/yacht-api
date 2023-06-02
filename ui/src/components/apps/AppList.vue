<template>
    <v-card :loading="isLoading.loading || loading">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <search-bar title="applications" color="surface" v-model:search="searchQuery">
            <template v-slot:btns>
                <v-btn icon @click='refresh()'>
                    <v-icon>mdi-restart</v-icon>
                </v-btn>
                <v-dialog class="create-dialog" persistent :fullscreen="maximize" :width="maximize ? undefined : '80vw'" scrollable
                    transition="dialog-bottom-transition">
                    <template v-slot:activator="{ props }">
                        <v-btn icon color="primary" v-bind="props"><v-icon icon="mdi-plus" /></v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <app-create @close="isActive.value = false" @maximize="maximize = !maximize" :maximize="maximize" />
                    </template>
                </v-dialog>
            </template>
        </search-bar>
        <v-sheet color="foreground">
            <v-tabs bg-color="surface" color="primary" align-tabs="center" v-model="serverTab">
                <v-tab v-for="appList, i in Object.keys(apps)" :value="i" :key="i">{{ appList }} </v-tab>
            </v-tabs>
            <v-fade-transition v-if="isLoading.items.get('apps')">
                <v-window>
                    <v-row dense>
                        <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="i in 12">
                            <v-skeleton-loader class="pa-1 pb-1" type="card" />
                        </v-col>
                    </v-row>
                </v-window>
            </v-fade-transition>
            <v-fade-transition v-else-if="apps">
                <v-window v-model="serverTab">
                    <v-window-item v-for="(appList, server, i) in apps" :value="i" :key="i">
                        <v-container>
                            <v-row dense>
                                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="app in appSearch(appList)"
                                    :key="app.shortId">
                                    <v-card :to="`/apps/${server}/${app.name}`" class="pa-1 pb-1" density="compact">
                                        <v-row dense no-gutters class="align-start">
                                            <v-col>
                                                <baseinfo :app="app" />
                                                <v-btn
                                                    :icon="revealActions[app.shortId] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                                    variant="text" color="primary"
                                                    v-on:click.prevent="revealActions[app.shortId] = !revealActions[app.shortId]">
                                                </v-btn>
                                                <v-btn v-if="app.mounts[0] || app.ports && app.ports[0] || app.info"
                                                    :icon="revealResources[app.shortId] ? 'mdi-information-off' : 'mdi-information'"
                                                    variant="text" color="primary"
                                                    v-on:click.prevent="revealResources[app.shortId] = !revealResources[app.shortId]">
                                                </v-btn>
                                                <iconstats v-if="isLoading.loading == true && isLoading.items.get('stats')"
                                                    :loading="true"></iconstats>
                                                <iconstats v-if="stats[app.name] && app.status === 'running'"
                                                    :stats="stats[app.name]" :loading="false" />
                                            </v-col>
                                        </v-row>
                                        <actions :app="app" :server="server" :reveal="revealActions[app.shortId]" />
                                        <Suspense>
                                            <resourcetab :app="app" :reveal="revealResources[app.shortId]" />
                                        </Suspense>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-window-item>
                </v-window>
            </v-fade-transition>
        </v-sheet>
    </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/apps'
import { ref, Ref } from 'vue';
// Import custom components
import SearchBar from '@/components/common/SearchBar.vue'
import AppCreate from './AppCreate.vue';
import baseinfo from '@/components/apps/list/base.vue'
import resourcetab from '@/components/apps/list/resourcetab.vue'
import actions from '@/components/apps/list/actions.vue'
import iconstats from '@/components/apps/list/stats.vue'
// Import store utilities
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useLoadingStore } from '@/stores/loading';
import { Container } from '@yacht/types';
// AppForm variables
const maximize: Ref<boolean> = ref(false)
// Card expansion variables
const revealActions = ref({})
const revealResources = ref({})
const serverTab = ref(0)
// Store variables
const loading = ref(true)
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
const appStore = useAppStore()
const { apps, stats } = storeToRefs(appStore)
// Initialize Search Variable
const searchQuery: Ref<string> = ref('')
// Filter apps by search variable
const appSearch = (appList: Container[]) => {
    const searchQueryLowerCase = searchQuery.value.toLowerCase();
    return appList.filter((app) => {
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
};
const refresh = (async () => {
    await appStore.fetchApps()
    appStore.fetchStats()
})
// Fetch Apps
onMounted(async () => {
    loading.value = isLoading.value.loading
    if (!apps.value[0] || !stats.value[0]) {
        await appStore.fetchApps()
        appStore.fetchStats()
    }
})
</script>
<style>
.v-app-bar-title__content {
    display: flex;
}
.create-dialog {
    position: absolute !important;
}
</style>

<route lang="yaml">
    meta:
        title: app list 2
        layout: default
</route>