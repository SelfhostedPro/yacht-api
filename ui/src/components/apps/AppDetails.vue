<template>
    <v-card>
        {{ appDetails }}
    </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/apps'
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
const props = defineProps(['name'])


// Store variables
const appStore = useAppStore()
const { appDetails, isLoading } = storeToRefs(appStore)
// Fetch App Details
onMounted(async () => {
    appStore.fetchAppDetails(props.name)
})
</script>