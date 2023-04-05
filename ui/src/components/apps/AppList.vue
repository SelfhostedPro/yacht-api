<template>
    <v-card-title>apps</v-card-title>
    <v-data-table v-model:items-per-page="itemsPerPage" @click:row="handleRowClick" :headers="tableHeaders" :items="apps">
    </v-data-table>
</template>

<script setup lang="ts">
import { ReadableContainerInfo, formatApps } from '@/composables/formatApps'
import { router } from '@/plugins'
import { ref } from 'vue';
const itemsPerPage = ref<number>(5)
const tableHeaders = [
    {
        title: "name",
        align: "start",
        value: "ShortName"
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

const handleRowClick = function (event,proxyItem) {
    const item = JSON.parse(JSON.stringify(proxyItem))
    router.push({ path: `/apps/${item.item.value.ShortName}` });
}

const apps = ref([])
fetch('http://localhost:3000/containers')
    .then(response => response.json())
    .then(data => apps.value = formatApps(data))
</script>