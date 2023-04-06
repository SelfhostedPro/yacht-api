<template>
    <v-card-title class="text-center" v-if="app != null"> {{ app['ShortName'] + ' details' }} </v-card-title>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatInspect } from '@/composables/formatApps'
const props = defineProps(['name'])

const app = ref(null)
fetch(`/api/containers/${props.name}`)
    .then(response => response.json())
    .then(data => app.value = formatInspect(data))
</script>