<template>
    <v-toolbar :extended="extended" extension-height="65" color="surface">
        <v-row>
            <v-col v-if="mdAndUp" cols="2" />
            <v-col :class="mdAndUp ? 'd-flex align-center justify-space-around' : 'd-flex align-center justify-start'">
                <v-toolbar-title :class="mdAndUp ? 'text-center' : 'text-start ml-5'">applications</v-toolbar-title>
            </v-col>
            <v-col cols="2" class="d-flex justify-end">
                <v-btn icon><v-icon icon="mdi-restart" /></v-btn>
                <v-dialog fullscreen transition="dialog-bottom-transition">
                    <template v-slot:activator="{ props }">
                        <v-btn icon color="primary" v-bind="props"><v-icon icon="mdi-plus" /></v-btn>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <v-card color="background">
                            <v-toolbar color="primary" title="Deploy new app">
                                <v-toolbar-items><v-btn icon="mdi-close" @click="isActive.value = false" />
                                </v-toolbar-items>
                            </v-toolbar>
                            <v-card-text class="ma-0 pa-0" tag="span">
                                <appform />
                            </v-card-text>
                        </v-card>
                    </template>
                </v-dialog>
                <v-btn @click="extended = !extended" icon class="mr-2"><v-icon icon="mdi-magnify" /></v-btn>
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
import appform from '../AppForm.vue'

// Display variables
const { mdAndUp } = useDisplay()

const props = defineProps(['search'])
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