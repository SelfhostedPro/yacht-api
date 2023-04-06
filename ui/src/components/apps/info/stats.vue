<template>
        <v-tooltip v-if="stats" :text="stats.MemoryPercentage.toFixed(2).toString() + ' %' || null" location="bottom">
                <template v-slot:activator="{ props }">
                        <v-progress-circular v-bind="props" class="mx-2 float-right" :model-value="stats.MemoryPercentage || 0"
                                :size="40" color="primary"><v-icon icon="mdi-chip" /></v-progress-circular>
                </template>
        </v-tooltip>
        <v-tooltip v-if="stats && stats.CpuUsage !== 'NaN'" :text="stats.CpuUsage.toFixed(2).toString() + ' %' || null"
                location="bottom">
                <template v-slot:activator="{ props }">
                        <v-progress-circular v-bind="props" class="mx-2 float-right" :model-value="stats.CpuUsage || 0"
                                :size="40" color="blue"><v-icon icon="mdi-memory" /></v-progress-circular>
                </template>
        </v-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatStats } from '@/composables/formatApps'
import { useEventSource } from '@vueuse/core'

const stats = ref(null)
const props = defineProps(['app'])

const { eventSource, status } = useEventSource(`/api/containers/${props.app.ShortId}/stats`)

eventSource.value.addEventListener('message', (message) => {
        if (status.value === 'OPEN') {
                stats.value = formatStats(JSON.parse(message.data))
        }
})

</script>