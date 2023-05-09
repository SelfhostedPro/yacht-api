<template>
    <v-container fluid>
        <v-card>
            <v-toolbar>
                <v-toolbar-title class="text-center">settings</v-toolbar-title>
            </v-toolbar>
            <div class="d-flex flex-row">
                <v-tabs v-model="tab" direction="vertical">
                    <v-tab :value="1">
                        general
                    </v-tab>
                    <v-tab :value="2">
                        users
                    </v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item :value="1">
                            <Suspense>
                                <general />
                            </Suspense>
                    </v-window-item>
                </v-window>
            </div>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import general from '@/components/settings/general.vue';
import { ref } from 'vue';
const tab = ref(1);
</script>

<style>
</style>