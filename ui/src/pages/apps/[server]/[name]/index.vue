<template>
    <app-details :name="props.name" :server="props.server" />
</template>

<script setup lang="ts">
import AppDetails from '@/components/apps/AppDetails.vue'

const props = defineProps(['server','name'])
</script>