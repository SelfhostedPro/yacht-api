<template>
    <v-card-title class="text-center">apps</v-card-title>
    <v-sheet color="foreground">
        <v-container>
            <v-row dense class="justify-space-between">
                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-if="apps" v-for="app in apps" :key="app.ShortName">
                    <v-card class="pa-1 pb-1" density="compact">
                        <v-row dense no-gutters class="align-start">
                            <v-col>
                                <baseinfo :app="app" />
                                <v-btn :icon="reveal[app.ShortId] ? 'mdi-chevron-up' : 'mdi-chevron-down'" variant="text"
                                    color="primary" v-on:click="reveal[app.ShortId] = !reveal[app.ShortId]">
                                </v-btn>
                                <stats v-if="app.State == 'running'" :app="app" />
                            </v-col>
                        </v-row>
                        <resourcetab :app="app" :reveal="reveal" />
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script setup lang="ts">
import { formatApps } from '@/composables/formatApps'
import { router } from '@/plugins'
import { ref } from 'vue';
import baseinfo from './info/base.vue'
import resourcetab from './info/resourcetab.vue'
import stats from './info/stats.vue'
const handleCardClick = function (event, proxyItem) {
    const item = JSON.parse(JSON.stringify(proxyItem))
    router.push({ path: `/apps/${item.item.value.ShortName}` });
}

const reveal = ref({})
const apps = ref([])
const fetchApp = function () {
    fetch('/api/containers')
        .then(response => response.json())
        .then(data => apps.value = formatApps(data))
}
fetchApp()
</script>