<template>
    <v-card-title v-if="registration" class="text-center"> setup </v-card-title>
    <v-card-title v-else class="text-center"> login </v-card-title>
    <v-card-text>
        <v-form fast-fail>
            <v-text-field v-model="username" label="username" append-inner-icon="mdi-account-circle" />
            <v-text-field v-model="password" label="password" type="password" append-inner-icon="mdi-shield-key" />
            <v-text-field v-if="registration" v-model="confirm" label="confirm" type="password" append-inner-icon="mdi-shield-key" />
        </v-form>
        <v-spacer />
        <v-btn v-if="registration" @keyup.enter="submit" v-on:click="submit" block color="primary" elevation="4">
            register
        </v-btn>
        <v-btn v-else @keyup.enter="submit" v-on:click="submit" block color="primary" elevation="4">
            submit
        </v-btn>
    </v-card-text>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';


const username: Ref<string> = ref(null)
const password: Ref<string> = ref(null)
const confirm: Ref<string> = ref(null)

const props = defineProps(['registration'])
const authStore = useAuthStore()

const submit = async () => {
    if (props.registration){
        authStore.userRegister({username: username.value, password: password.value, admin: true})
    } else {
        authStore.userLogin({username: username.value, password: password.value})
    }
}

</script>