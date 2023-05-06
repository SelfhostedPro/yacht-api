<template>
    <v-card>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col>
                    <v-text-field label="cpu cores" placeholder="1" :value="limits.cpus"
                        @input="setName($event.target.value)" hide-details="auto"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field label="memory" placeholder="1000b|100k|10m|1g" :value="limits.mem_limits"
                        @input="setValue($event.target.value)" hide-details="auto"></v-text-field>
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


const limits = computed({
    get() {
        return props.modelValue
    },
    set(limits) {
        emit('update:modelValue', limits)
    }
})

const setName = (value) => {
    emit('update:modelValue', { ...limits.value, cpus: value })
}

const setValue = (value) => {
    emit('update:modelValue', { ...limits.value, mem_limits: value })
}

const { mdAndDown } = useDisplay()

</script>
  