<template>
    <v-card class="logcontainer" :loading="isLoading.items.has('logs')">
        <v-toolbar> <v-toolbar-title>logs</v-toolbar-title> 
        <v-toolbar-items>
            <v-btn v-if="closable" icon @click="$emit('close')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar-items>
        </v-toolbar>
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <v-card-text v-if="logs.length === 0" class="logtext">
            Fetching logs for {{ name }} on {{ server }}
        </v-card-text>
        <v-virtual-scroll v-else class="keep-whitespace" :item-height="8" :items="logs">
            <template v-slot:default="{ item, index }">
                <p v-html="item" class="logtext"></p>
                <p ref="logEnd" ></p>
            </template>
        </v-virtual-scroll>
    </v-card>
</template>
<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import { useEventSource } from '@vueuse/core'
import { useLoadingStore } from '@/stores/loading'
import { useNotifyStore } from '@/stores/notifications'
import { VVirtualScroll } from 'vuetify/components'
import { default as AnsiUp } from 'ansi_up';
import { storeToRefs } from 'pinia'
interface Props {
    server: string,
    name: string,
    closable: boolean
}
defineEmits(['close'])
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
const logEnd: Ref<HTMLParagraphElement | null> = ref(null)
const props = defineProps<Props>()
const logs: Ref<string[]> = ref([])

const loadStats = async () => {
    loadingStore.startLoadingItem('logs')
    const { eventSource, error, data } = useEventSource(`/api/containers/info/${props.server}/${props.name}/logs`)
    if (!error.value) {
        eventSource.value.onopen = () => {
            loadingStore.stopLoadingItem('logs')
        }
        const AU = new AnsiUp()
        eventSource.value.addEventListener('message', (message) => {
            if (eventSource.value.OPEN) {
                logs.value.push(AU.ansi_to_html(message.data));
            }
        })
        eventSource.value.addEventListener('error', async () => {
                    await new Promise(f => setTimeout(f, 1000));
                    loadStats()
                })
    } else {
        console.log(data.value)
        const notify = useNotifyStore()
        loadingStore.stopLoadingItem('logs')
        notify.setError(`Stats Error: ${error.value}`)
        throw new Error
    }
}

onMounted(async () => {
    await loadStats()
    logEnd.value?.scrollIntoView({ behavior: 'smooth' })
})
</script>

<style>
.logtext {
    font: 1rem monospace;
}

.logcontainer {
    background-color: var(--v-background-base) !important;
}

.keep-whitespace {
    white-space: pre;
}
</style>