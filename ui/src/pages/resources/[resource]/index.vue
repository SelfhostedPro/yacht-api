<template>
    <v-container fluid>
        <ResourceList :name="resource"></ResourceList>
    </v-container>
</template>
<script setup lang="ts">
import ResourceList from '@/components/resources/ResourceList.vue';
interface Props {
    resource: "networks" | "images" | "volumes"
}
defineProps<Props>()
</script>