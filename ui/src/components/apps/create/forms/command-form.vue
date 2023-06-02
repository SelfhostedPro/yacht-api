<template>
    <v-card flat>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col cols="12">
                    <v-text-field label="command" placeholder="/bin/setup" v-model="command"
                        hide-details="auto"></v-text-field>
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


const command = computed({
  get() {
    return props.modelValue
  },
  set(command) {
    emit('update:modelValue', command)
  }
})

const { mdAndDown } = useDisplay()

</script>
  