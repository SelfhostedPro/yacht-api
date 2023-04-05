<template>
    <v-card-title> APP LIST</v-card-title>
    <v-card-text v-for="app in apps" :key="app.Id">{{ app.Names[0] }}</v-card-text>
    <v-data-table v-model:items-per-page="itemsPerPage" :headers="tableHeaders" :items="apps" value="Id">
    </v-data-table>
</template>

<script setup lang="ts">
import { formatApps, ReadableContainerInfo } from '@/composables/formatApps'
import { ref } from 'vue';
const itemsPerPage = ref<number>(5)
const tableHeaders = [
    {
        title: "name",
        align: "start",
        value: "Names[0]"
    },
    {
        title: "state",
        align: "start",
        value: "State"
    },
    {
        title: "image",
        align: "start",
        value: "Image"
    },
    {
        title: "created",
        align: "start",
        value: "CreatedDate"
    }
]

const apps = ref([])
fetch('http://localhost:3000/containers')
    .then(response => response.json())
    .then(data => apps.value = formatApps(data))
</script>