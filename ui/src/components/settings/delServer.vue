<template>
    <v-card>
        <v-card-title>
            Remove {{ server.name }}?
        </v-card-title>
        <v-card-text>
            Remove {{ server.name }} from Yacht? You can choose to remove your public key from the remote server as well.
            No data/containers will be removed from the remote server. This just removes the ability to control it remotely
            from Yacht.
            <v-switch label="remove public key from server"></v-switch>
            <v-switch label="delete local key"></v-switch>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="$emit('close')">Cancel</v-btn>
            <v-btn color="warning" @click="$emit('close')">Remove</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
defineEmits(['close'])
defineProps(['server'])