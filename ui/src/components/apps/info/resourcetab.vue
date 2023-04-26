<template>
    <v-expand-transition>
        <div v-show="reveal[app.shortId]">
            <v-row no-gutters>
                <v-col>
                    <v-tabs color="primary" show-arrows grow mandatory v-model="tab[app.shortId]">
                        <v-tab v-on:click.prevent v-if="app.ports[0]" rounded="0" value="0" title="ports" />
                        <v-tab v-on:click.prevent v-if="app.mounts[0]" rounded="0" value="1" title="mounts" />
                        <v-tab v-on:click.prevent v-if="app.labels" rounded="0" value="2" title="info" />
                    </v-tabs>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-window class="mt-2" v-model="tab[app.shortId]">
                        <v-window-item v-if="app.ports[0]" value="0">
                            <portinfo :app="app" />
                        </v-window-item>
                        <v-window-item v-if="app.mounts[0]" value="1">
                            <mountinfo :app="app" />
                        </v-window-item>
                        <v-window-item v-if="app.labels" value="2">
                            <info :app="app" />
                        </v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </div>
    </v-expand-transition>
</template>

<script setup lang="ts">
import portinfo from './ports.vue'
import mountinfo from './mounts.vue'
import info from './info.vue';
import { ref } from 'vue';
const tab = ref({})
import { Container } from '@/types/apps';
interface Props {
    app: Container,
    reveal: boolean
}
defineProps<Props>()
</script>

<style>
.v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
}
</style>