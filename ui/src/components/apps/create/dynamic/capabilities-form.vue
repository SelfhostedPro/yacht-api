<template>
    <v-card>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col>
                    <v-select label="add" :items="addable" v-model="capabilities.add" @update:model-value="setName($event)"
                        hide-details="auto" multiple />
                </v-col>
                <v-col>
                    <v-select label="drop" :items="dropable" v-model="capabilities.drop"
                        @update:model-value="setValue($event)" hide-details="auto" multiple />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const addable = ["SYS_MODULE", "SYS_RAWIO", "SYS_PACCT", "SYS_ADMIN", "SYS_NICE", "SYS_RESOURCE", "SYS_TIME", "SYS_TTY_CONFIG", "AUDIT_CONTROL", "MAC_ADMIN", "MAC_OVERRIDE", "NET_ADMIN", "SYSLOG", "DAC_READ_SEARCH", "LINUX_IMMUTABLE", "NET_BROADCAST", "IPC_LOCK", "IPC_OWNER", "SYS_PTRACE", "SYS_BOOT", "LEASE", "WAKE_ALARM", "BLOCK_SUSPEND"]

const dropable = ["AUDIT_WRITE", "CHOWN", "DAC_OVERRIDE", "FOWNER", "FSETID", "KILL", "SETGID", "SETUID", "SETPCAP", "NET_BIND_SERVICE", "NET_RAW", "SYS_CHROOT"]


const capabilities = computed({
    get() {
        return props.modelValue
    },
    set(capabilities) {
        emit('update:modelValue', capabilities)
    }
})

console.log(capabilities)


const setName = (value) => {
    emit('update:modelValue', { ...capabilities.value, add: value })
}

const setValue = (value) => {
    emit('update:modelValue', { ...capabilities.value, drop: value })
}

const { mdAndDown } = useDisplay()

</script>
  