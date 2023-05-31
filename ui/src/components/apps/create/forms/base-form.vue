<template>
    <v-card flat>
        <v-card-text>
            <v-row :dense="mdAndDown" align="center">
                <v-col cols="12">
                    <v-text-field label="name" placeholder="yacht" v-model="base.name" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                    <v-text-field label="image" placeholder="ghcr.io/selfhostedpro/yacht-api:main" v-model="base.image"
                        hide-details="auto" />
                </v-col>
                <v-col cols="12">
                    <v-select :items="['always', 'on-failure', 'unless-stopped', 'none']" v-model="base.restart"
                        label="restart policy" hide-details="auto" />
                </v-col>
                <v-col cols="12">
                    <v-select :items="servers" v-model="base.server" label="server" hide-details="auto" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
const props = defineProps(['modelValue', 'servers'])
const emit = defineEmits(['update:modelValue'])
const base = computed({
    get() {
        return props.modelValue
    },
    set(base) {
        emit('update:modelValue', base)
    }
})
const { mdAndDown } = useDisplay()
</script>
  