<template>
    <v-card>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col :cols="mdAndDown == true ? 12 : undefined">
                    <v-text-field label="sysctl" placeholder="net.ipv6.conf.all.disable_ipv6" :value="sysctls.name"
                        @input="setName($event.target.value)" hide-details="auto"></v-text-field>
                </v-col>
                {{ mdAndDown == true ? null : '=' }}
                <v-col :cols="mdAndDown == true ? 12 : undefined">
                    <v-text-field label="value" placeholder="1" :value="sysctls.value"
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


const sysctls = computed({
    get() {
        return props.modelValue
    },
    set(sysctls) {
        emit('update:modelValue', sysctls)
    }
})

const setName = (value) => {
    emit('update:modelValue', { ...sysctls.value, name: value })
}

const setValue = (value) => {
    emit('update:modelValue', { ...sysctls.value, value: value })
}

const { mdAndDown } = useDisplay()

</script>
  