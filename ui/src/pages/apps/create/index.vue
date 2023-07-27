<template>
    <v-container fluid>
            <AppForm></AppForm>
    </v-container>
</template>

<script setup lang="ts">
import AppForm from '@/components/apps/AppCreate.vue';
</script>

<route lang="yaml">
    meta:
        title: create
        layout: default
</route>
