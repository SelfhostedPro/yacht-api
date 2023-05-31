<template>
    <v-card flat>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col>
                    <v-text-field label="host" placeholder="/dev/sda" :value="devices.host"
                        @input="setHost($event.target.value)" hide-details="auto"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field label="container" placeholder="/dev/xvdc" :value="devices.container"
                        @input="setContainer($event.target.value)" hide-details="auto"></v-text-field>
                </v-col>
                <v-col>
                    <v-select label="permissions" :items="['r', 'w', 'm', 'mw', 'rm', 'rwm', 'rw']"
                        v-model="devices.permissions" @update:model-value="setPermissions($event)"
                        hide-details="auto"></v-select>
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


const devices = computed({
    get() {
        return props.modelValue
    },
    set(devices) {
        emit('update:modelValue', devices)
    }
})

const setHost = (value) => {
    emit('update:modelValue', { ...devices.value, host: value })
}

const setContainer = (value) => {
    emit('update:modelValue', { ...devices.value, container: value })
}

const setPermissions = (value) => {
    emit('update:modelValue', { ...devices.value, permissions: value.toString() })
}

const { mdAndDown } = useDisplay()

</script>
  