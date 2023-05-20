<template>
    <v-card color="background" class="logcontainer" :loading="isLoading.items.has('logs')">
        <v-card-title class="pa-0">
            <v-toolbar align-center> <v-toolbar-title>logs</v-toolbar-title>
                <v-toolbar-items class="text-center">
                    <v-tooltip :text="timestamps ? 'disable timestamps' : 'enable timestamps'">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon @click="toggleTimestamps()">
                                <v-icon v-if="timestamps" color="green"> mdi-clock-time-four-outline </v-icon>
                                <v-icon v-else> mdi-clock-time-four-outline </v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip v-if="isSupported" :text="'copy logs to clipboard'">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon @click="copy(logs.join(''))">
                                <v-icon v-if="!copied"> mdi-content-copy </v-icon>
                                <v-icon color="green" v-else> mdi-check </v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip v-if="isSupported" :text="'maximize'">
                        <template v-slot:activator="{ props }">
                            <v-btn v-if="closable" v-bind="props" icon @click="$emit('maximize')">
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
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <v-card-text v-if="logs.length === 0" class="logtext">
            Fetching logs for {{ name }} on {{ server }}
        </v-card-text>
        <v-virtual-scroll v-else class="keep-whitespace" :item-height="8" :items="logs">
            <template v-slot:default="{ item, index }">
                <p v-html="item" class="logtext"></p>
            </template>
        </v-virtual-scroll>
        <p ref="logEnd"></p>
    </v-card>
</template>
<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
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
defineEmits(['close', 'maximize'])
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
const { isSupported, copy, copied, } = useClipboard()
const logEnd: Ref<HTMLParagraphElement | null> = ref(null)
const props = defineProps<Props>()
const logs: Ref<string[]> = ref([])
const logStream: Ref<EventSource | null> = ref(null)
const timestamps: Ref<boolean> = ref(false)

const loadStats = async () => {
    loadingStore.startLoadingItem('logs')
    const { eventSource, error, data } = useEventSource(`/api/containers/info/${props.server}/${props.name}/logs${timestamps.value.valueOf() === true ? '/true' : ''}`)
    if (!error.value) {
        logStream.value = eventSource.value
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
        const notify = useNotifyStore()
        loadingStore.stopLoadingItem('logs')
        notify.setError(`Stats Error: ${error.value}`)
        throw new Error
    }
}

const toggleTimestamps = async () => {
    timestamps.value = !timestamps.value
    if (logStream.value) logStream.value.close()
    logs.value = []
    await loadStats()
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

.keep-whitespace {
    white-space: pre;
}
</style>