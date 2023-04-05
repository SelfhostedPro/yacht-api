<template>
    <v-container fluid>
        <v-card>
            <app-details :name="props.name" />
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import AppDetails from '@/components/apps/AppDetails.vue'

const props = defineProps(['name'])
</script>