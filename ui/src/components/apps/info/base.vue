<template>
    <v-card-item class="px-2 pb-0" density="compact" prepend-avatar="https://cdn.vuetifyjs.com/images/cards/halcyon.png">
        <v-card-title>
            <v-tooltip :text="app['Status']" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-avatar class="ml-1" v-bind="props" :color="app.State == 'running' ? 'primary' : 'red'"
                        size="6"></v-avatar>
                </template>
            </v-tooltip>
            {{ ' ' + app['ShortName'] }}
        </v-card-title>
        <v-card-subtitle>{{ 'image: ' + app['Image'] }}</v-card-subtitle>
        <v-card-subtitle>{{ 'id: ' + app['ShortId'] }}</v-card-subtitle>
    </v-card-item>
</template>

<script setup lang="ts">
const props = defineProps(['app', 'details'])

</script>