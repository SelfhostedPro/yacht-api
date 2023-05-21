<template>
    <v-toolbar color="surface">
        <v-row>
            <v-col v-if="mdAndUp" cols="2" />
            <v-col :class="mdAndUp ? 'd-flex align-center justify-space-around' : 'd-flex align-center justify-start'">
                <v-toolbar-title :class="mdAndUp ? 'text-center' : 'text-start ml-5'">templates</v-toolbar-title>
            </v-col>
            <v-col cols="2" class="d-flex justify-end">
                <v-btn icon><v-icon icon="mdi-restart" /></v-btn>
            </v-col>
        </v-row>
    </v-toolbar>
</template>
<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()
</script>