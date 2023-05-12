<template>
    <v-card>
        <v-card-title>
            Remove server {{ server.name }}?
        </v-card-title>
        <v-card-text>
            Remove server {{ server.name }} from Yacht?
            {{ server.options.protocol === 'ssh' ? 'You can choose to remove your public key from the remote server as well as the local server(if no other servers are using it).' : null }}
            No data/containers will be removed from the {{ server.options.protocol === 'ssh' ? 'remote ' : null }} server.
            This just removes the ability to control it {{  server.options.protocol === 'ssh' ? 'remotely' : null }}
            from Yacht.
            <v-switch v-model="removeOptions.removeRemoteKey" v-if="server.options.protocol === 'ssh'"
                label="remove public key from server"></v-switch>
            <v-switch v-model="removeOptions.removeLocalKey"
                v-if="!keyInOtherServers() && server.options.protocol === 'ssh'" label="delete local key"></v-switch>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="$emit('close')">Cancel</v-btn>
            <v-btn color="warning" @click="remove()">Remove</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { ref } from 'vue'
const settingsStore = useSettingsStore()
const emit = defineEmits(['close'])
const props = defineProps(['server', 'servers'])
const removeOptions = ref({
    name: props.server.name,
    removeRemoteKey: false,
    removeLocalKey: false
})

const remove = async () => {
    await settingsStore.removeServer(removeOptions.value.name, removeOptions.value.removeRemoteKey, removeOptions.value.removeLocalKey)
        .then(() => {
            emit('close')
        })
        .catch((e) => {
            return
        })
}

const keyInOtherServers = () => {
    const otherServers = props.servers.filter((s) => s.key === props.server.key)
    if (otherServers.length > 1) {
        return true
    }
    return false
}
</script>