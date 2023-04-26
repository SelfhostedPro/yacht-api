<template>
    <v-card :loading="isLoading.get('fetchApps')">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <v-card-title class="text-center">apps</v-card-title>
        <v-sheet color="foreground">
            <v-container>
                <v-row dense class="justify-space-between">
                    <v-fade-transition v-if="apps" group>
                        <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="app in apps"
                            :key="app.ShortName">
                            <v-card :to="'/apps/' + app.ShortId" class="pa-1 pb-1" density="compact">
                                <v-row dense no-gutters class="align-start">
                                    <v-col>
                                        <baseinfo :app="app" />
                                        <v-btn :icon="revealActions[app.ShortId] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                            variant="text" color="primary"
                                            v-on:click.prevent="revealActions[app.ShortId] = !revealActions[app.ShortId]">
                                        </v-btn>
                                        <v-btn v-if="app.Mounts[0] || app.Ports[0]"
                                            :icon="revealResources[app.ShortId] ? 'mdi-information-off' : 'mdi-information'"
                                            variant="text" color="primary"
                                            v-on:click.prevent="revealResources[app.ShortId] = !revealResources[app.ShortId]">
                                        </v-btn>
                                            <iconstats v-if="stats" :stats="stats[app.ShortName]" :app="app"
                                                :loading="!isLoading.get('fetchStats')" />
                                    </v-col>
                                </v-row>
                                <actions :app="app" :reveal="revealActions" />
                                <resourcetab :app="app" :reveal="revealResources" />
                            </v-card>
                        </v-col>
                    </v-fade-transition>
                </v-row>
            </v-container>
            <!-- <pre>{{ apps }}</pre> -->
        </v-sheet>
    </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/apps'
import { ref } from 'vue';
import baseinfo from './info/base.vue'
import resourcetab from './info/resourcetab.vue'
import actions from './info/actions.vue'
import iconstats from './info/stats.vue'
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

// Card expansion variables
const revealActions = ref({})
const revealResources = ref({})

// Store variables
const appStore = useAppStore()
const { apps, stats, isLoading } = storeToRefs(appStore)

// Fetch Apps
onMounted(async () => {
    if (!apps[0] || !stats[0]) {
        appStore.fetchApps()
        appStore.fetchStats()
    }
})

const handleRefresh = async () => {
    appStore.resetApps()
}
</script>
