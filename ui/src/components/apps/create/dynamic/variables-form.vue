<template>
    <v-card>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col :cols="mdAndDown == true ? 12 : undefined">
                    <v-text-field :label="environment.label || 'name'" placeholder="PUID" v-model="environment.name"
                        @input="setName($event.target.value)" hide-details="auto"></v-text-field>
                </v-col>
                {{ mdAndDown == true ? null : '=' }}
                <v-col :cols="mdAndDown == true ? 12 : undefined">
                    <v-text-field label="value" placeholder="1000" v-model="environment.value"
                        @input="setValue($event.target.value)" hide-details="auto"></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-if="environment.description">{{ environment.description }}</v-card-text>
    </v-card>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
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

</script>
  