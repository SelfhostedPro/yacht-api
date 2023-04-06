<template>
        <v-slide-group v-if="app.Mounts">
        <v-slide-group-item v-for="mount in app.Mounts" :key="mount.Destination">
            <v-btn elevation="4" size="small" variant="tonal" class="ma-1"
            color='warning'> {{ mount["Destination"] }}</v-btn>
        </v-slide-group-item>
    </v-slide-group>

</template>

<script setup lang="ts">
defineProps(['app'])

</script>