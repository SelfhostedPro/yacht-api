<template>
    <v-navigation-drawer v-if="!mdAndDown" height="100vh" :permanent="locked" elevation="10" floating
        :expand-on-hover="true" :rail="!locked">
        <v-img max-height="100" class="mx-2 mt-2" :src="logo"
            style="filter: brightness(5)" />
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
                <v-btn size="large" variant="text" icon="mdi-github" target="_blank"
                    href="https://github.com/SelfhostedPro/Yacht" />
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import vuetify from '@/plugins/vuetify';

import { miniLogo } from "@/composables/logo"
import { ref } from 'vue';
import { useDisplay } from 'vuetify'
const logo = miniLogo()
const { mdAndDown } = useDisplay()
defineProps(['links'])
const locked = ref(false)

</script>