<template>
    <v-expand-transition>
        <div v-show="reveal[app.ShortId]">
            <v-row no-gutters>
                <v-col>
                    <v-tabs color="primary" show-arrows grow mandatory v-model="tab[app.ShortId]">
                        <v-tab v-if="app.Ports[0]" rounded="0" value="1" title="ports" />
                        <v-tab v-if="app.Mounts[0]" rounded="0" value="2" title="mounts" />
                    </v-tabs>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-window class="mt-2" v-model="tab[app.ShortId]">
                        <v-window-item v-if="app.Ports[0]" value="1">
                            <portinfo :app="app" />
                        </v-window-item>
                        <v-window-item v-if="app.Mounts[0]" value="2">
                            <mountinfo :app="app" />
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
import { ref } from 'vue';
const tab = ref({})
defineProps(['app', 'reveal'])
</script>

<style>
.v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
}
</style>