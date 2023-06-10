<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="plain"><v-icon icon="mdi-plus"></v-icon></v-btn>
        </template>

        <v-list width="40vw">
            <v-list-item class="align-center">
                <div class="d-flex align-center">
                    <v-text-field dense label="template url" v-model="url" hide-details="auto"
                        :error-messages="v$.url.$errors.map(e => e.$message.toString())" @input="v$.url.$touch"
                        @blur="v$.url.$touch" />
                    <v-btn v-if="templateValid === true" class="mt-1" variant="plain" color="primary" :rounded="0" append-icon="mdi-plus"
                        text="add" />
                    <v-btn v-else :loading="loading" @click="loading = true; validate()" class="mt-1" variant="plain"
                        :rounded="0" append-icon="mdi-eye-outline" text="check" />
                </div>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { helpers, required, url as urlValidator } from '@vuelidate/validators';
import { useAuthFetch } from '@/helpers/auth/fetch';
import { useNotifyStore } from '@/stores/notifications';
import { ref, Ref } from 'vue';

const url: Ref<string> = ref('')
const templateValid = ref(false)
const loading = ref(false)



const isGithubUrl = (url: string) => {
    return url.includes('github.com') ? false : true
}

const rules = {
    url: {
        required: helpers.withMessage('Template url is required.', required),
        url: helpers.withMessage('Template url must be valid url.', urlValidator),
        isGithubUrl: helpers.withMessage('Github url must be raw.githubusercontent.com url.', isGithubUrl)
    }
}

const v$ = useVuelidate(rules, { url })

const validate = async () => {
    const { data, isFetching } = await useAuthFetch<string>(url.value)
    loading.value = isFetching.value
    try {
        JSON.parse(data.value)
        templateValid.value = true
        return
    } catch (e) {
        const notify = useNotifyStore()
        templateValid.value = false
        if (e instanceof SyntaxError) {
            if (e.message.startsWith("Unexpected token '<'")) {
                notify.setError(`${e.name}: Template url is not valid json and appears to be html or xml \n\nDid you remember to use the raw url?\n${e.message}`)
            } else {
                notify.setError(`${e.name}: Template is not valid json - ${e.message}`)
            }
            return
        }
        notify.setError(e.message)
    }
}
</script>