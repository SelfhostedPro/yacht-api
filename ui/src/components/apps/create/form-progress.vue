<template>
    <v-timeline class="my-2" truncate-line="both" side="end" line-inset="8">
        <v-timeline-item dot-color="primary" v-for="step, i in steps" :key="i"
            max-width="80vw"
            :size="modelValue === i ? 'default' : 'x-small'"
            :class="modelValue === i ? 'font-weight-regular' : 'font-weight-light text-disabled'"
            @click="$emit('update:modelValue', i)">
            <v-alert v-if="modelValue === i" :title="step.title" :text="step.description"></v-alert>
            {{ modelValue !== i ? step.title : null }}
        </v-timeline-item>
    </v-timeline>
</template>
<script setup lang="ts">
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

const steps = [
    { title: 'base', description: 'Basic information about your container.' },
    { title: 'info', description: 'Information that will be added to the labels of your container' },
    { title: 'networking', description: 'Networking configuration for your container.' },
    { title: 'storage', description: 'Storage configuration for your container.' },
    { title: 'environment', description: 'Environment variables for your container.' },
]
</script>