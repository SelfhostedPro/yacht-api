<template>
    <v-card>
        <v-card-title>
            Remove {{ server.name }}?
        </v-card-title>
        <v-card-text>
            Remove {{ server.name }} from Yacht? You can choose to remove your public key from the remote server as well as
            remove the local private key if no other servers are using it (please check carefully otherwise you will need to remove and readd them).
            No data/containers will be removed from the remote server. This just removes the ability to control it remotely from Yacht.
            <v-switch label="remove public key from server"></v-switch>
            <v-switch label="delete local key"></v-switch>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
defineEmits(['close'])
defineProps(['server'])