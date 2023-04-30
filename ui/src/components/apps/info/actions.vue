<template>
    <v-expand-transition>
        <div v-show="reveal">
            <v-btn-group divided block class="d-flex justify-center">
                <v-tooltip v-for="action in actions" :key="action.name" :text="action.name" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" v-if="action.depends.includes(app.status) || action.depends.includes('all')"
                            v-on:click.prevent="handleAction(action.name)"
                            :size="mdAndDown ? 'small' : 'default'" :color="action.color" class="my-1">
                            <v-icon :icon="action.icon" />
                        </v-btn>
                    </template>
                </v-tooltip>
            </v-btn-group>
        </div>
    </v-expand-transition>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { Container } from '@yacht/types';
import { useAppStore } from '@/stores/apps';
interface Props {
    app: Container,
    reveal: any
}
const props = defineProps<Props>()
const { mdAndDown } = useDisplay()
const appStore = useAppStore()

const handleAction = async (action: string) => {
    await appStore.fetchAppAction(props.app.id, action)
    appStore.fetchStats()
}

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
.v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
}
</style>