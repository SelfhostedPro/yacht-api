<template>
        <v-progress-circular v-if="loading" class="mx-2 float-right" indeterminate :size="40" color="primary"><v-icon icon="mdi-chip" /></v-progress-circular>
        <v-tooltip v-else-if="stats" :text="stats.MemoryPercentage + ' %' || null" location="bottom">
                <template v-slot:activator="{ props }">
                        <v-progress-circular v-bind="props" class="mx-2 float-right" :indeterminate="loading" :model-value="stats.MemoryPercentage || 0"
                                :size="40" color="primary"><v-icon icon="mdi-chip" /></v-progress-circular>
                </template>
        </v-tooltip>
        <v-progress-circular v-if="loading" class="mx-2 float-right" indeterminate :size="40" color="blue"><v-icon icon="mdi-memory" /></v-progress-circular>
        <v-tooltip v-else-if="stats" :text="stats.CpuUsage + ' %' || null" location="bottom">
                <template v-slot:activator="{ props }">
                        <v-progress-circular v-bind="props" class="mx-2 float-right" :indeterminate="loading" :model-value="stats.CpuUsage || 0"
                                :size="40" color="blue"><v-icon icon="mdi-memory" /></v-progress-circular>
                </template>
        </v-tooltip>
</template>

<script setup lang="ts">
import { YachtContainerStat } from '@yacht/types';
interface Props {
    stats?: YachtContainerStat,
    loading?: boolean
}
defineProps<Props>()

</script>
