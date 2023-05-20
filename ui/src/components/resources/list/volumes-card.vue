<template>
    <v-card class="overflow-auto" id="volumes-card">
        <v-card-title>{{ resource.Name }} <v-btn @click="reveal = !reveal" variant="plain" icon><v-icon
                    :icon="reveal ? 'mdi-chevron-up' : 'mdi-chevron-down'" /></v-btn></v-card-title>
        <v-expand-transition>
            <v-card-text v-show="reveal">
                <pre>{{ resource }}</pre>
            </v-card-text>
        </v-expand-transition>
        <v-card-subtitle>created: {{ formatDates(parseInt(resource['CreatedAt'])) }}</v-card-subtitle>
        <v-card-subtitle>driver: {{ resource.Driver }}</v-card-subtitle>
        <v-card-subtitle class="mb-2">mount: {{ resource.Mountpoint }}</v-card-subtitle>
    </v-card>
</template>
<script setup lang="ts">
import { VolumeInspectInfo } from 'dockerode';
import { fromUnixTime } from 'date-fns';
import { ref } from 'vue';

const reveal = ref(false)

interface Props {
    server: string,
    resource: VolumeInspectInfo
}
defineProps<Props>()

const formatDates = (date: number) => {
    return fromUnixTime(date).toLocaleString()
}

</script>