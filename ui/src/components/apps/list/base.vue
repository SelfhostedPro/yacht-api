<template>
    <v-card-item class="px-2 pb-0" density="compact"
        :prepend-avatar="app.info.icon ? app.info.icon : 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'">
        <v-card-title>
            <v-tooltip :text="app.state" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-avatar class="ml-1" v-bind="props" :color="app.status == 'running' ? 'primary' : 'red'"
                        size="6"></v-avatar>
                </template>
            </v-tooltip>
            {{ ' ' + app.name }}
        </v-card-title>
        <v-card-subtitle>{{ 'image: ' + app.image }}</v-card-subtitle>
        <v-card-subtitle>{{ 'id: ' + app.shortId }}</v-card-subtitle>
    </v-card-item>
</template>

<script setup lang="ts">
import { Container } from '@yacht/types';
interface Props {
    app: Container
}
defineProps<Props>()

</script>