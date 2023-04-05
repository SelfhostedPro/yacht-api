<template>
    <v-navigation-drawer :permanent="locked" :expand-on-hover="true" :rail="!locked">
        <v-btn class="my-2 mx-2" :icon="locked ? 'mdi-lock' : 'mdi-lock-open'" density="comfortable"
            v-on:click="locked = !locked" />
        <v-divider />
        <v-list nav dense>
            <div v-for="(link, i) in links" :key="i">
                <v-list-item v-if="!link.subLinks" :to="link.to" :title="link.text" :prepend-icon="link.icon" exact
                    class="mt-1" />

                <v-list-group v-else :key="link.text" :prepend-icon="link.icon" :value="false">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" :title="link.text" :prepend-icon="link.icon" />
                    </template>

                    <v-list-item v-for="sublink in link.subLinks" :to="sublink.to" :key="sublink.text" :title="sublink.text"
                        :prepend-icon="sublink.icon" exact class="mb-1" />
                </v-list-group>
                <v-divider />
            </div>
        </v-list>

        <template v-slot:append>
            <div>
                <v-btn size="large" variant="text" icon="mdi-file-document" target="_blank" href="https://yacht.sh" />
                <br />
                <v-btn size="large" variant="text" icon="mdi-github" target="_blank" href="https://github.com/SelfhostedPro/Yacht" />
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const locked = ref(false)
const links = [
    {
        to: "/",
        icon: "mdi-view-dashboard",
        text: "Dashboard",
        divider: true
    },
    {
        text: "Applications",
        to: "/apps",
        icon: "mdi-application"
    },
    {
        text: "Templates",
        to: "/templates",
        icon: "mdi-folder"
    },
    {
        text: "Projects",
        to: "/projects",
        icon: "mdi-book-open"
    },
    {
        icon: "mdi-cube-outline",
        text: "Resources",
        subLinks: [
            {
                text: "Images",
                to: "/resources/images",
                icon: "mdi-disc"
            },
            {
                text: "Volumes",
                to: "/resources/volumes",
                icon: "mdi-database"
            },
            {
                text: "Networks",
                to: "/resources/networks",
                icon: "mdi-network"
            }
        ]
    },
    {
        to: "/settings/info",
        icon: "mdi-cog",
        text: "Settings"
    }
]
</script>