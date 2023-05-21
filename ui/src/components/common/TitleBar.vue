<template>
    <v-card-title class="pa-0">
        <v-toolbar :color="color" align-center> <v-toolbar-title>{{ title || null }}</v-toolbar-title>
            <v-toolbar-items class="text-center">
                <slot name="btns"></slot>
                <v-tooltip v-if="closable" :text="'maximize'">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon @click="$emit('maximize')">
                            <v-icon>mdi-fullscreen</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-btn v-if="closable" icon @click="$emit('close')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </v-card-title>
</template>
<script setup lang="ts">
defineEmits(['close', 'maximize'])
defineProps(['closable', 'title', 'color'])
</script>