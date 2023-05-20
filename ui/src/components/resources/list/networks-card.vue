<template>
    <v-card class="overflow-auto" id="networks-card">
        <v-card-title>{{ resource.Name }}</v-card-title>
        <v-card-text>
            <pre>{{ resource }}</pre>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import { NetworkInspectInfo } from 'dockerode';

interface Props {
    resource: NetworkInspectInfo
}
defineProps<Props>()
</script>