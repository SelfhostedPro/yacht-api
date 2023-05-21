<template>
    <v-toolbar :extended="extended" extension-height="65" :color="color || 'surface'">
        <v-row>
            <v-col v-if="mdAndUp" cols="2" />
            <v-col :class="mdAndUp ? 'd-flex align-center justify-space-around' : 'd-flex align-center justify-start'">
                <v-toolbar-title :class="mdAndUp ? 'text-center' : 'text-start ml-5'">{{ title || null }}</v-toolbar-title>
            </v-col>
            <v-col cols="2" class="d-flex justify-end">
                <slot name="btns"></slot> <!-- Slot for additional buttons -->
                <v-btn @click="extended = !extended" icon class="mr-2"><v-icon icon="mdi-magnify" /></v-btn>
                <slot name="appendBtns"></slot>
            </v-col>
        </v-row>
        <template v-slot:extension v-if="extended">
            <v-responsive max-width="400" class="mx-auto">
                <v-text-field variant="solo-filled" v-model="searchModel"
                    @input="$emit('update:search', $event.target.value)" placeholder="Search..." />
            </v-responsive>
        </template>
    </v-toolbar>
</template>

<script setup lang="ts">
import { Ref, computed, ref } from 'vue';
import { useDisplay } from 'vuetify'

// Display variables
const { mdAndUp } = useDisplay()

const props = defineProps(['search', 'title', 'color'])
const emits = defineEmits(['update:search'])

const searchModel = computed({
    // getter
    get() {
        return props.search
    },
    // setter
    set(searchModel) {
        // Note: we are using destructuring assignment syntax here.
        emits('update:search', searchModel)
    }
})
// Search variables
const extended: Ref<boolean> = ref(false)

</script>