<template>
    <v-card-title> general </v-card-title>
    <v-form v-if="settings.base">
        <v-text-field label="page name" v-model="settings.base.name"></v-text-field>
        <v-select :items="[true, false]" v-model="settings.base.auth" label="auth" required></v-select>
        <v-select :items="['light', 'dark']" v-model="settings.base.theme" label="theme" required></v-select>
    </v-form>
        {{ settings }}
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';
const settingStore = useSettingsStore()
const { settings } = storeToRefs(settingStore)

onMounted(async () => {
    settingStore.fetchSettings()
})
</script>