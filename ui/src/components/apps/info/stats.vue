<template>
        <v-tooltip v-if="stats[app.name]" :text="stats[app.name].MemoryPercentage + ' %' || null" location="bottom">
                <template v-slot:activator="{ props }">
                        <v-progress-circular v-bind="props" class="mx-2 float-right" :indeterminate="!loading || stats[app.name].CpuUsage === 'NaN'" :model-value="stats[app.name].MemoryPercentage || 0"
                                :size="40" color="primary"><v-icon icon="mdi-chip" /></v-progress-circular>
                </template>
        </v-tooltip>
        <v-tooltip v-if="stats[app.name]" :text="stats[app.name].CpuUsage + ' %' || null" location="bottom">
                <template v-slot:activator="{ props }">
                        <v-progress-circular v-bind="props" class="mx-2 float-right" :indeterminate="!loading || stats[app.name].CpuUsage === 'NaN'" :model-value="stats[app.name].CpuUsage || 0"
                                :size="40" color="blue"><v-icon icon="mdi-memory" /></v-progress-circular>
                </template>
        </v-tooltip>
</template>

<script setup lang="ts">
import { Container, ReadableContainerStats } from '@/types/apps';
interface Props {
    app: Container,
    stats: ReadableContainerStats,
    loading: Map<string, boolean>
}
defineProps<Props>()

</script>
