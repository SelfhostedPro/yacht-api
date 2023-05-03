<template>
    <v-tooltip>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props"
                :color="ports.length === 0 ? 'warning' : 'surface'" @click="addPort()" size="x-large" flat rounded="0"
                class="float-right"><v-icon icon="mdi-plus" /></v-btn>
        </template>
    </v-tooltip>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { defineEmits } from 'vue';
const ParentProps = {
    resource: any[]
}
</script>