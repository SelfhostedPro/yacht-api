<template>
    <v-timeline v-if="!smAndDown" class="my-2" truncate-line="both" side="end" line-inset="8">
        <v-timeline-item
            :dot-color="props.errors.find(e => e.$params.parent === step.title) ? 'error' : modelValue >= i ? 'primary' : 'secondary'"
            v-for="step, i in steps" :key="i" max-width="80vw" :size="modelValue === i ? 'default' : 'x-small'"
            :class="modelValue === i ? 'font-weight-regular' : 'font-weight-light text-disabled'"
            @click="$emit('update:modelValue', i)">
            <v-fade-transition hide-on-leave>
                <v-alert color="foreground" :rounded="0" v-if="modelValue === i" :title="step.title"
                    :text="step.description"></v-alert>
            </v-fade-transition>
            <v-fade-transition hide-on-leave>
                {{ modelValue !== i ? step.title : null }}
            </v-fade-transition>
        </v-timeline-item>
    </v-timeline>
    <div v-else>
        <v-card-title>{{ steps[modelValue].title }}</v-card-title>
        <v-card-text>{{ steps[modelValue].description }}</v-card-text>
    </div>
</template>
<script setup lang="ts">
import { useDisplay } from 'vuetify';
const { smAndDown } = useDisplay()
const props = defineProps(['modelValue', 'errors'])
defineEmits(['update:modelValue'])

const steps = [
    { title: 'base', description: 'Basic information about your container.' },
    { title: 'info', description: 'Information that will be added to the labels of your container' },
    { title: 'networking', description: 'Networking configuration for your container.' },
    { title: 'storage', description: 'Storage configuration for your container.' },
    { title: 'environment', description: 'Environment variables for your container.' },
    { title: 'advanced', description: `Advanced container settings. Only change if you need to.` },
    { title: 'preview', description: `Preview your container before deploying.` }
]
</script>