<template>
    <v-card color="foreground" :rounded="0">
        <v-card-text>
            <v-form v-if="settings && settings.base">
                <v-text-field label="page name" v-model="settings.base.name"></v-text-field>
                <v-select :items="[true, false]" v-model="settings.base.auth" label="auth" required></v-select>
                <v-select :items="['light', 'dark']" v-model="settings.base.theme" label="theme" required></v-select>
            </v-form>
            <v-row>
                <v-col cols="4" v-for="server in servers">
                    <v-card>
                        <v-row>
                            <v-col><v-card-title>{{ server.name }} </v-card-title></v-col>
                            <v-col cols="2"><v-btn @click="serverRemoveModal = true" icon="mdi-close"></v-btn></v-col>
                        </v-row>
                        <v-card-subtitle v-if="server.options.protocol == 'ssh' && server.key">key: {{ server.key
                        }}</v-card-subtitle>
                        <v-card-text> {{ server.options }}</v-card-text>
                        <v-dialog v-model="serverRemoveModal" :width="500">
                            <delServer @close="serverRemoveModal = false" :server="server" :servers="servers" />
                        </v-dialog>
                    </v-card>
                </v-col>
                <v-col cols="4">
                    <v-card color="secondary" @click="serverAddModal = true" :link="true">
                        <v-card-title> add </v-card-title>
                        <v-card-text class="text-center"> <v-icon icon="mdi-plus" />
                        </v-card-text>
                        <v-dialog v-model="serverAddModal" :width="500">
                            <addServer @close="serverAddModal = false" />
                        </v-dialog>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    {{ settings }}
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import addServer from './addServer.vue'
import delServer from './delServer.vue';
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';
const serverAddModal = ref(false)
const serverRemoveModal = ref(false)
const settingStore = useSettingsStore()
const { settings, servers } = storeToRefs(settingStore)

onMounted(async () => {
    settingStore.fetchSettings()
    settingStore.fetchServers()
})
</script>