<template>
    <v-card>
        <v-toolbar>
            <v-toolbar-title>storage</v-toolbar-title>
        </v-toolbar>
        <v-tabs v-model="tab" color="primary">
            <v-tab rounded="0" value="0" title="mounts" />
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item value="0">
                <v-list v-if="app.mounts[0]">
                    <v-list-item v-for="mount in app.mounts" :key="mount.destination" class="text-no-wrap">
                        <v-list-item-title>{{ mount.destination }}</v-list-item-title>
                        <v-list-item-subtitle>{{ `type: ${mount['type']}` }}</v-list-item-subtitle>
                        <v-list-item-subtitle v-if="mount.name">{{ `name: ${mount.name}` }}</v-list-item-subtitle>
                        <v-list-item-subtitle v-if="mount['Driver']">{{ `driver: ${mount['driver']}`
                        }}</v-list-item-subtitle>
                        <v-list-item-subtitle>{{ `read-only: ${!mount['rw']}` }}</v-list-item-subtitle>
                        {{ `source: ${mount.source}` }}
                    </v-list-item>
                </v-list>
                <v-card-text v-else>No mounts configured.</v-card-text>
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@/types/apps';
import { ref } from 'vue';
interface Props {
    app: Container
}
defineProps<Props>()
const tab = ref(0)
</script>