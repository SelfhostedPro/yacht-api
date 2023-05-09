<template>
    <v-tooltip :text="tooltipText()">
        <template v-slot:activator="{ props }">
            <v-slide-y-reverse-transition>
                <v-btn v-bind="props" :color="resources.length === 0 ? 'warning' : 'primary'" @click="$emit('add')"
                    :size="size || 'x-large'" flat :rounded="rounded || 0" :variant="variant || 'elevated'"
                    :icon="icon || false" class="float-right"><v-icon icon="mdi-plus" /></v-btn>
            </v-slide-y-reverse-transition>
        </template>
    </v-tooltip>
</template>

<script setup lang="ts">
interface Props {
    resources?: any[],
    name?: string,
    rounded?: string | number | boolean,
    icon?: boolean,
    variant?: string,
    size?: string
}
const props = defineProps<Props>()
defineEmits(['add'])
const tooltipText = () => {
    const hasName = !!props.name;
    const hasResources = props.resources.length !== 0;
    return hasName
        ? (hasResources ? `add ${props.name.endsWith('s') ? props.name : props.name + 's'}` : `no ${props.name} added yet. click here to add one.`)
        : (hasResources ? 'add resource' : 'no resources added yet. click here to add one.');
}

</script>