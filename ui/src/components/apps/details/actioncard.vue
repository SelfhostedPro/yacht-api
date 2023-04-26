<template>
    <v-card>
        <v-toolbar>
            <v-tooltip v-for="action in actions" :key="action.name" :text="action.name" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" v-if="action.depends.includes(app.status) || action.depends.includes('all')"
                        :size="mdAndDown ? 'small' : 'default'" :color="action.color" :prepend-icon="action.icon"
                        class="my-1">
                        {{ action.name }}
                    </v-btn>
                </template>
            </v-tooltip>
        </v-toolbar>
    </v-card>
</template>

<script setup lang="ts">
import { Container } from '@/types/apps';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
interface Props {
    app: Container
}
const props = defineProps<Props>()
const { mdAndDown } = useDisplay()

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
}
</style>