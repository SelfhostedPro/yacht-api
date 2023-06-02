<template>
    <v-card flat>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col :cols="formCols('label')">
                    <v-text-field label="label" placeholder="config" v-model="volume.label" @input="setLabel($event.target.value)"
                        hide-details="auto"></v-text-field>
                </v-col>
                <v-col :cols="formCols('source')">
                    <v-text-field label="source" placeholder="/home/user/config" v-model="volume.source" @input="setSource($event.target.value);v$.source.$touch"
                        hide-details="auto"
                        @blur="v$.source.$touch"
                        :error-messages="v$.source.$errors.map(e => e.$message.toString())"
                        ></v-text-field>
                </v-col>
                <v-col :cols="formCols('destination')">
                    <v-text-field label="destination" placeholder="/config" v-model="volume.destination" @input="setDestination($event.target.value)"
                        hide-details="auto"></v-text-field>
                </v-col>
                <v-col :cols="formCols('readonly')" class="text-center">
                    <v-btn color="secondary" :block="mdAndDown" :icon="mdAndDown" rounded="lg"
                        :variant="volume.read_only ? 'flat' : 'outlined'" @click="setRead(!volume.read_only)">
                        <v-icon :icon="volume.read_only ? 'mdi-lock' : 'mdi-lock-open'" /> {{ mdAndDown ? null : 'ro'
                        }} </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

const { smAndDown, mdAndDown } = useDisplay()
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const volume = computed({
    get() {
        return props.modelValue
    },
    set(volumes) {
        emit('update:modelValue', volumes)
    }
})

const setLabel = (value) => {
    emit('update:modelValue', { ...volume.value, label: value })
}
const setSource = (value) => {
    emit('update:modelValue', { ...volume.value, source: value })
}
const setDestination = (value) => {
    emit('update:modelValue', { ...volume.value, destination: value })
}
const setRead = (value) => {
    emit('update:modelValue', { ...volume.value, read_only: value })
}

const formCols = (field: 'label' | 'source' | 'destination' | 'readonly') => {
    const cols = {
        label: { sm: '12', other: '12' },
        source: { sm: '12', other: '5' },
        destination: { sm: '9', other: '5' },
        readonly: { sm: '3', other: '2' },
    };
    return smAndDown.value === true ? cols[field].sm : cols[field].other;
};
const rules = {
    source: {
        required: helpers.withMessage('source is required', helpers.withParams({ parent: 'storage'}, required))
    },
}
const v$ = useVuelidate(rules, volume)

</script>