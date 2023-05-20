<template>
    <v-container fluid>
            <AppList></AppList>
    </v-container>
</template>

<script setup lang="ts">
import AppList from '@/components/apps/AppList.vue';
</script>

<route lang="yaml">
    meta:
        title: app list
        layout: default
</route>