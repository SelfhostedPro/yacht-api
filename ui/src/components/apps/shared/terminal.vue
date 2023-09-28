<template>
    <v-card color="background" class="logcontainer" :loading="isLoading.items.has('terminal')">
        <title-bar :closable="true" :title="$props.name + ' terminal'" @maximize="$emit('maximize')"
            @close="$emit('close')">
            <template v-slot:btns>
                <!-- <v-tooltip v-if="isSupported" :text="'copy logs to clipboard'">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon @click="copy(logs.join(''))">
                            <v-icon v-if="!copied"> mdi-content-copy </v-icon>
                            <v-icon color="green" v-else> mdi-check </v-icon>
                        </v-btn>
                    </template>
                </v-tooltip> -->
            </template>
        </title-bar>
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <v-card-text v-if="terminalContent.length === 0" class="logtext">
            Fetching logs for {{ name }} on {{ server }}
        </v-card-text>
        <v-virtual-scroll v-else class="keep-whitespace" :item-height="8" :items="terminalContent">
            <template v-slot:default="{ item, index }">
                <p class="logtext">{{ item.toString() }}</p>
            </template>
        </v-virtual-scroll>
        <p ref="logEnd"></p>
    </v-card>
</template>
<script setup lang="ts">
// TODO: Fix this
//@ts-ignore
import TitleBar from '@/components/common/TitleBar.vue'
import { Ref, onMounted, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useLoadingStore } from '@/stores/loading'
import { useNotifyStore } from '@/stores/notifications'
import { VVirtualScroll } from 'vuetify/components'
import AnsiUp from 'ansi_up';
import { storeToRefs } from 'pinia'
import { io, Socket } from "socket.io-client";
import { da } from 'date-fns/locale'

interface Props {
    server: string,
    name: string,
    closable: boolean
}
defineEmits(['close', 'maximize'])
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)

const props = defineProps<Props>()
// // copy text to clipboard
// const { isSupported, copy, copied, } = useClipboard()

// terminal text
const terminalContent: Ref<string[]> = ref([])
// initial stream object so we can close it outside of the function if needed.
const webSocket: Ref<Socket | null> = ref(null)

const loadStats = async () => {
    loadingStore.startLoadingItem('terminal')
    const AU = new AnsiUp()

    console.log('attempting to connect to backend.')

    // Connection to backend
    const proto = location.protocol === 'https:' ? 'wss' : 'ws'
    webSocket.value = io(`${proto}://${location.hostname}:${location.port}/terminal`, {
        transports: ['websocket'],
        withCredentials: true
    })
    
    webSocket.value.on('connection_error', () => {
        console.log('connection error')
    })

    webSocket.value.on('connect', () => {
        loadingStore.stopLoadingItem('terminal')
        console.log('connected to backend.')
    })

    webSocket.value.on('container', (data) => {
        console.log(data)
        terminalContent.value.push(AU.ansi_to_html(data))
        console.log(terminalContent.value)
    })

    webSocket.value.emit('start-session', props.name)
}

onMounted(async () => {
    await loadStats()
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