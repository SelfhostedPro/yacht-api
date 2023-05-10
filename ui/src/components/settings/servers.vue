<template>
    <v-card-title>add server</v-card-title>
    <v-card-text>
        <v-text-field label="name" ></v-text-field>     
        <v-select label="protocol" :items="['ssh','local']"></v-select>
        <v-text-field v-if="protocol === 'local'" label="socket path" placeholder="/var/run/docker.sock"></v-text-field>

        <v-text-field v-if="protocol === 'ssh'" label="host"></v-text-field>
        <v-text-field v-if="protocol === 'ssh'" label="username" />
        <v-select v-if="protocol === 'ssh'" label="key" :items="keys"></v-select>

        <v-text-field label="new key" />
        <v-text-field label="passphrase" />

    </v-card-text>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const protocol = ref('local')
const keys = ref(['base','other'])
</script>