<template>
    <v-card-title class="text-center">apps</v-card-title>
    <v-sheet color="foreground">
        <v-container>
            <v-row dense class="justify-space-between">
                <v-fade-transition group>
                    <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-if="apps" v-for="app in apps"
                        :key="app.ShortName">
                        <v-card :to="'/apps/'+app.ShortId" class="pa-1 pb-1" density="compact">
                            <v-row dense no-gutters class="align-start">
                                <v-col>
                                    <baseinfo :app="app" />
                                    <v-btn :icon="revealActions[app.ShortId] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                        variant="text" color="primary"
                                        v-on:click.prevent="revealActions[app.ShortId] = !revealActions[app.ShortId]">
                                    </v-btn>
                                    <v-btn v-if="app.Mounts[0] || app.Ports[0]" :icon="revealResources[app.ShortId] ? 'mdi-information-off' : 'mdi-information'"
                                        variant="text" color="primary"
                                        v-on:click.prevent="revealResources[app.ShortId] = !revealResources[app.ShortId]">
                                    </v-btn>
                                    <stats v-if="statsList[app.ShortName]" :stats="statsList[app.ShortName]" :app="app">
                                    </stats>
                                </v-col>
                            </v-row>
                            <actions :app="app" :reveal="revealActions" />
                            <resourcetab :app="app" :reveal="revealResources" />
                        </v-card>
                    </v-col>
                </v-fade-transition>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script setup lang="ts">
import { ReadableContainerInfo } from '@/composables/formatApps'
import { router } from '@/plugins'
import { ref } from 'vue';
import type { Ref } from 'vue';
import baseinfo from './info/base.vue'
import resourcetab from './info/resourcetab.vue'
import actions from './info/actions.vue'
import stats from './info/stats.vue'
import { tryOnBeforeUnmount } from '@vueuse/core'
const revealActions = ref({})
const revealResources = ref({})
const apps: Ref<ReadableContainerInfo[]> = ref([])
const statsList = ref({})

// Get all apps
const fetchApps = async function () {
    fetch('/api/containers')
        .then(response => response.json())
        .then(data => apps.value = data)
}
fetchApps()

// Get live stats for all apps
const statSource = new EventSource(`/api/containers/stats`)
statSource.addEventListener('message', (message) => {
    if (statSource.OPEN) {
        const stat = JSON.parse(message.data)
        statsList.value[stat.Name] = JSON.parse(message.data)
    }
})

// Close EventSource before leaving page
tryOnBeforeUnmount(() => {
    statSource.close()
})
</script>
<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>