<template>
    <v-card>
        <!-- <baseinfo :app="app" :details="true" /> -->
        {{ app }}
    </v-card>
</template>

<script setup lang="ts">
import { ReadableContainerInfo } from '@/composables/formatApps';
import baseinfo from './info/base.vue'
import { Ref, ref } from 'vue'
const props = defineProps(['name'])

const app: Ref<ReadableContainerInfo> = ref()
const fetchApp = async function () {
    fetch(`/api/containers/info/${props.name}`)
        .then(response => response.json())
        .then(data => app.value = data)
}
fetchApp()
</script>