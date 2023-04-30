<template>
    <v-card>
        <v-toolbar>
            <v-toolbar-title>configuration</v-toolbar-title>
        </v-toolbar>
        <v-tabs v-model="tab" color="primary">
            <v-tab rounded="0" value="0" title="environment" />
            <v-tab rounded="0" value="1" title="labels" />
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item value="0">
                <v-list v-if="app.env && app.env[0]">
                    <v-list-item v-for="env in app.env" :key="env.split('=')[0]" class="text-no-wrap">
                        <v-list-item-title>{{ env.split('=')[0]  }}</v-list-item-title>
                        <v-list-item-subtitle>{{ env.split('=')[1] }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <v-card-text v-else>No environment variables configured.</v-card-text>
            </v-window-item>
            <v-window-item value="1">
                <v-list v-if="app.labels">
                    <v-list-item v-for="value,label in app.labels" :key="label" class="text-no-wrap">
                        <v-list-item-title>{{ label  }}</v-list-item-title>
                        <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <v-card-text v-else>No labels configured.</v-card-text>
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@yacht/types';
import { ref } from 'vue';
interface Props {
    app: Container
}
defineProps<Props>()
const tab = ref(0)
</script>