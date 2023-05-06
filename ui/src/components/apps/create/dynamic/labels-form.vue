<template>
    <v-card>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col :cols="mdAndDown == true ? 12 : undefined">
                    <v-text-field label="label" placeholder="com.example.some-label" :value="labels.name"
                        @input="setName($event.target.value)" hide-details="auto"></v-text-field>
                </v-col>
                {{ mdAndDown == true ? null : '=' }}
                <v-col :cols="mdAndDown == true ? 12 : undefined">
                    <v-text-field label="value" placeholder="value" :value="labels.value"
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


const labels = computed({
    get() {
        return props.modelValue
    },
    set(labels) {
        emit('update:modelValue', labels)
    }
})

const setName = (value) => {
    emit('update:modelValue', { ...labels.value, name: value })
}

const setValue = (value) => {
    emit('update:modelValue', { ...labels.value, value: value })
}

const { mdAndDown } = useDisplay()

</script>
  