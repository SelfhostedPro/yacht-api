<template>
        <v-slide-group v-if="app.mounts">
        <v-slide-group-item v-for="mount in app.mounts" :key="mount.destination">
            <v-btn elevation="4" size="small" variant="tonal" class="ma-1"
            color='warning'> {{ mount["Destination"] }}</v-btn>
        </v-slide-group-item>
    </v-slide-group>

</template>

<script setup lang="ts">
import { Container } from '@/types/apps';
interface Props {
    app: Container,
}
defineProps<Props>()

</script>