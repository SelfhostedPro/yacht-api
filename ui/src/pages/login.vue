<template>
    <v-container fluid class="fill-height">
        <v-row>
            <v-col>
                <v-card class="mx-auto" max-width="400px" color="foreground">
                        <v-img class="mx-auto mt-5" max-height="76" alt="Vue logo" :src="logo" />
                    <LoginForm :registration="firstSetup"></LoginForm>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import LoginForm from "@/components/auth/LoginForm.vue"
import { Logo } from "@/composables/logo"
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted } from 'vue';

const authStore = useAuthStore()
const { firstSetup, authDisabled} = storeToRefs(authStore)

// Fetch Apps
onMounted(async () => {
    if (firstSetup.value == null || authDisabled.value == null) {
        console.log("Getting auth settings")
        authStore.authCheck()
    }
})


const logo = Logo()
</script>

<route lang="yaml">
meta:
    layout: login
    public: true
</route>