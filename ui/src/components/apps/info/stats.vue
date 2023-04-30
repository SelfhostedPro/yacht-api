<template>
        <v-tooltip v-if="stats" :text="stats.MemoryPercentage + ' %' || null" location="bottom">
                <template v-slot:activator="{ props }">
                        <v-progress-circular v-bind="props" class="mx-2 float-right" :indeterminate="!loading" :model-value="stats.MemoryPercentage || 0"
                                :size="40" color="primary"><v-icon icon="mdi-chip" /></v-progress-circular>
                </template>
        </v-tooltip>
        <v-tooltip v-if="stats" :text="stats.CpuUsage + ' %' || null" location="bottom">
                <template v-slot:activator="{ props }">
                        <v-progress-circular v-bind="props" class="mx-2 float-right" :indeterminate="!loading" :model-value="stats.CpuUsage || 0"
                                :size="40" color="blue"><v-icon icon="mdi-memory" /></v-progress-circular>
                </template>
        </v-tooltip>
</template>

<script setup lang="ts">
import { Container, YachtContainerStat } from '@yacht/types';
interface Props {
    app: Container,
    stats: YachtContainerStat,
    loading: boolean
}
defineProps<Props>()

</script>
