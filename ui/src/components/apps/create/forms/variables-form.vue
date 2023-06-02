<template>
    <v-card flat>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col :cols="mdAndDown == true ? 12 : undefined">
                    <v-text-field :label="environment.label || 'name'" placeholder="PUID" v-model="environment.name"
                        @input="setName($event.target.value);v$.name.$touch" hide-details="auto"
                        @blur="v$.name.$touch"
                        :error-messages="v$.name.$errors.map(e => e.$message.toString())"
                        ></v-text-field>
                </v-col>
                {{ mdAndDown == true ? null : '=' }}
                <v-col :cols="mdAndDown == true ? 12 : undefined">
                    <v-text-field label="value" placeholder="1000" v-model="environment.value"
                        @input="setValue($event.target.value);v$.value.$touch" hide-details="auto"
                        @blur="v$.value.$touch"
                        :error-messages="v$.value.$errors.map(e => e.$message.toString())"
                        ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-if="environment.description">{{ environment.description }}</v-card-text>
    </v-card>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { onMounted } from 'vue';

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])


const environment = computed({
    get() {
        return props.modelValue
    },
    set(environment) {
        emit('update:modelValue', environment)
    }
})

const setName = (value) => {
    emit('update:modelValue', { ...environment.value, key: value })
}

const setValue = (value) => {
    emit('update:modelValue', { ...environment.value, value: value })
}

const { mdAndDown } = useDisplay()

const rules = {
    name: {
        required: helpers.withMessage('Variable name is required', helpers.withParams({ parent: 'environment'}, required))
    },
    value: {
        required: helpers.withMessage('Variable value is required', helpers.withParams({ parent: 'environment'}, required))
    }
}
const v$ = useVuelidate(rules, environment)

onMounted(() => {
    v$.value.$touch()
})
</script>
  