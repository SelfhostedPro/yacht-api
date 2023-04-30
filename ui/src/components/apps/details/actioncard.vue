<template>
    <v-card>
        <v-toolbar>
            <v-tooltip v-for="action in actions" :key="action.name" :text="action.name" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" v-if="action.depends.includes(app.status) || action.depends.includes('all')"
                        v-on:click.prevent="action.name === 'remove' ? removeDialog = !removeDialog : $emit('action', action.name)"
                        :size="mdAndDown ? 'small' : 'default'" :color="action.color" :prepend-icon="action.icon"
                        class="my-1">
                        {{ action.name }}
                    </v-btn>
                </template>
            </v-tooltip>
        </v-toolbar>
        <v-dialog v-model="removeDialog">
            <v-card max-width="290" class="mx-auto">
                <v-card-title class="text-no-wrap">
                    Remove {{ app.name }} <v-btn variant="plain"><v-icon icon="mdi-window-close" /></v-btn>
                </v-card-title>
                <v-card-text>
                    Are you sure you want to permanently remove
                    {{ app.name }}?<br />
                    All non peristent data will be removed.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="removeDialog = false">cancel</v-btn>
                    <v-btn
                        @click="$emit('action', 'remove'); removeDialog = false; this.$router.push(this.$router.options.history.state.back)"
                        prepend-icon="mdi-trash-can" color="red">confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@yacht/types';
import { Ref, ref } from 'vue';
import { useDisplay } from 'vuetify';
defineEmits(['action'])
// import data from parent
interface Props {
    app: Container
}
const removeDialog: Ref<boolean> = ref(false)
defineProps<Props>()
const { mdAndDown } = useDisplay()


// buttons
const actions = [
    {
        name: "start",
        icon: "mdi-play",
        color: "success",
        depends: ["stopped", "created", "exited"]
    },
    {
        name: "restart",
        icon: "mdi-restore",
        color: "warning",
        depends: ["running", "stopped", "created", "exited", "paused"]
    },
    {
        name: "stop",
        icon: "mdi-stop",
        color: "error",
        depends: ["running", "paused"]
    },
    {
        name: "pause",
        icon: "mdi-pause",
        color: "info",
        depends: ["running"]
    },
    {
        name: "unpause",
        icon: "mdi-play-outline",
        color: "success",
        depends: ["paused"]
    },
    {
        name: "kill",
        icon: "mdi-fire",
        color: "error",
        depends: ["all"]
    },
    {
        name: "remove",
        icon: "mdi-delete",
        color: "error",
        depends: ["all"]
    }
]
</script>

<style>
.v-toolbar__content {
    display: flex;
    justify-content: space-around;
}</style>