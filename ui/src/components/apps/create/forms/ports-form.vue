<template>
    <v-card flat>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col :cols="formCols('label')">
                    <v-text-field label="label" placeholder="webui" v-model="port.label" hide-details="auto"
                        :messages="port.label ? undefined : 'Port labels are recommended but not required.'"></v-text-field>
                </v-col>
                <v-col :cols="formCols('host')">
                    <v-text-field
                        :disabled="Array.isArray(port.unchangable) && port.unchangable.includes('host') || port.unchangable === true"
                        label="host" placeholder="8080" v-model="port.host" hide-details="auto" @input="v$.host.$touch"
                        :error-messages="v$.host.$errors.map(e => e.$message.toString())"
                        @blur="v$.host.$touch"></v-text-field>
                </v-col>
                <v-col :cols="formCols('container')">
                    <v-text-field
                        :disabled="Array.isArray(port.unchangable) && port.unchangable.includes('container') || port.unchangable === true"
                        label="container" placeholder="80" v-model="port.container" hide-details="auto"
                        @input="v$.container.$touch" :error-messages="v$.container.$errors.map(e => e.$message.toString())"
                        @blur="v$.container.$touch"></v-text-field>
                </v-col>
                <v-col :cols="formCols('protocol')">
                    <v-select
                        :disabled="Array.isArray(port.unchangable) && port.unchangable.includes('protocol') || port.unchangable === true"
                        label="protocol" :items="['udp', 'tcp']" v-model="port.protocol" hide-details="auto"
                        @input="v$.protocol.$touch" :error-messages="v$.protocol.$errors.map(e => e.$message.toString())"
                        @blur="v$.protocol.$touch"></v-select>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
  
<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])


const port = computed({
    get() {
        return props.modelValue
    },
    set(port) {
        emit('update:modelValue', port)
    }
})

const isPort = helpers.withParams({ parent: 'networking' }, helpers.regex(/^([1-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/))
const rules = {
    host: {
        isPort: helpers.withMessage('host must be a valid port (0-65535)', isPort),
    },
    container: {
        isPort: helpers.withMessage('container must be a valid port (0-65535)', isPort),
    },
    protocol: {
        required: helpers.withMessage('protocol is required', helpers.withParams({ parent: 'networking' }, required)),
    }
}

const v$ = useVuelidate(rules, props.modelValue)

const { mdAndDown, smAndDown } = useDisplay()

const formCols = (field: 'label' | 'host' | 'container' | 'protocol' | 'card' | 'button') => {
    const cols = {
        label: { sm: '12', other: '12' },
        host: { sm: '12', other: '4' },
        container: { sm: '12', other: '4' },
        protocol: { sm: '12', other: '4' },
        card: { sm: '10', other: '11' },
        button: { sm: '2', other: '1' }
    };
    return smAndDown.value === true ? cols[field].sm : cols[field].other;
};
</script>
  