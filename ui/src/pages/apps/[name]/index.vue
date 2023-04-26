<template>
    <app-details :name="props.name" />
</template>

<script setup lang="ts">
import AppDetails from '@/components/apps/AppDetails.vue'

const props = defineProps(['name'])
</script>