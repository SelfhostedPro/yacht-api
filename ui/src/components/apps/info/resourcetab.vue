<template>
    <v-expand-transition>
        <div v-show="reveal">
            <v-row no-gutters>
                <v-col>
                    <v-tabs color="primary" show-arrows grow mandatory v-model="tab">
                        <v-tab v-on:click.prevent rounded="0" value="0"> ports </v-tab>
                        <v-tab v-on:click.prevent v-if="app.mounts[0]" rounded="0" value="1">mounts</v-tab>
                        <v-tab v-on:click.prevent rounded="0" value="2">info</v-tab>
                    </v-tabs>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-window class="mt-2" v-model="tab">
                        <v-window-item v-if="app.ports && app.ports[0]" value="0">
                            <portinfo :app="app" />
                        </v-window-item>
                        <v-window-item v-else value="0">
                            <v-card-text> {{ app.name }} {{ app.status !== 'running' ? 'is not running' : 'has no ports forwarded' }} </v-card-text>
                        </v-window-item>
                        <v-window-item v-if="app.mounts[0]" value="1">
                            <mountinfo :app="app" />
                        </v-window-item>
                        <v-window-item v-if="app.info && app.info.title" value="2">
                            <info :app="app" />
                        </v-window-item>
                        <v-window-item v-else value="2">
                            <v-card-text> {{ app.name }} does not provide <a href="https://github.com/opencontainers/image-spec/blob/main/annotations.md">oci labels</a>. </v-card-text>
                        </v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </div>
    </v-expand-transition>
</template>

<script setup lang="ts">
import portinfo from '@/components/apps/info/ports.vue'
import mountinfo from '@/components/apps/info/mounts.vue'
import info from '@/components/apps/info/info.vue';
import { ref } from 'vue';
const tab = ref(0)
import { Container } from '@/types/apps';
interface Props {
    app: Container,
    reveal: any
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