<template>
    <v-menu v-model="menuOpen" :close-on-content-click="false" transition="slide-y-transition">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="plain"><v-icon icon="mdi-plus"></v-icon></v-btn>
        </template>
        <v-expand-transition>
            <v-list width="40vw">
                <v-list-item class="align-center">
                    <div class="d-flex align-center">
                        <v-text-field dense label="template url" v-model="form.url" hide-details="auto"
                            placeholder="https://raw.githubusercontent.com/SelfhostedPro/yacht-api/main/default_template.json"
                            :error-messages="v$.url.$errors.map(e => e.$message.toString())" @input="v$.url.$touch"
                            @blur="v$.url.$touch" />
                        <v-btn :loading="loading" @click="templateValid = false; loading = true; validate()" class="mt-1"
                            variant="plain" :rounded="0" append-icon="mdi-magnify" text="check" />
                    </div>
                </v-list-item>
                <v-expand-transition>
                    <div v-show="templateValid">
                        <v-list-item>
                            <v-text-field dense label="name" placeholder="default" v-model="form.name" hide-details="auto"
                                :error-messages="v$.name.$errors.map(e => e.$message.toString())" @input="v$.name.$touch"
                                @blur="v$.name.$touch" hint="name of folder created in templates directory" />
                            <v-text-field dense label="title" placeholder="Yacht Template" v-model="form.title"
                                hide-details="auto" hint="used for tab name on this page." />
                            <v-btn v-if="templateValid" block :loading="loading || loadingStore.isLoading.loading"
                                @click="loading = true; submit()" class="mt-1" variant="plain" :rounded="0"
                                append-icon="mdi-plus" text="add" :disabled="v$.$errors.length > 0" />
                        </v-list-item>
                    </div>
                </v-expand-transition>
            </v-list>
        </v-expand-transition>
    </v-menu>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { helpers, required, requiredIf, url as urlValidator } from '@vuelidate/validators';
import YAML from 'yaml'
import { useAuthFetch } from '@/helpers/auth/fetch';
import { useNotifyStore } from '@/stores/notifications';
import { useTemplateStore } from '@/stores/templates'
import { useLoadingStore } from '@/stores/loading';
import { ref, Ref } from 'vue';

const emit = defineEmits(['added'])

const loadingStore = useLoadingStore()
const menuOpen = ref(false)

interface form {
    url: string,
    name: string,
    title?: string
}
const templateValid = ref(false)
const loading = ref(false)
const form: Ref<form> = ref({
    url: '',
    name: ''
})

const isGithubUrl = (url: string) => {
    return url.includes('github.com') ? false : true
}

const templateExists = (name: string) => {
    const { templates } = useTemplateStore()
    return templates.find(t => t.name === name) ? false : true
}

const rules = {
    url: {
        required: helpers.withMessage('Template url is required.', required),
        url: helpers.withMessage('Template url must be valid url.', urlValidator),
        isGithubUrl: helpers.withMessage('Github url must be raw.githubusercontent.com url.', isGithubUrl)
    },
    name: {
        required: helpers.withMessage('Template name is required.', requiredIf(templateValid)),
        duplicate: helpers.withMessage('Template name already exists.', templateExists)
    }
}

const v$ = useVuelidate(rules, form)

const validate = async () => {
    const { data, isFetching } = await useAuthFetch<string>(form.value.url).get()
    loading.value = isFetching.value
    try {
        const templateJSON = YAML.parse(data.value) || JSON.parse(data.value)
        console.log(templateJSON)
        templateValid.value = true
        if (templateJSON['name']) {
            form.value.name = templateJSON['name']
            v$.value.$touch()
        }
        if (templateJSON['title']) {
            form.value.title = templateJSON['title']
        }
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
        console.error(e)
        notify.setError(`${e.name}: ${e.message}`)
    }
}
const submit = async () => {
    const { addTemplate } = useTemplateStore()
    await addTemplate(form.value.url, form.value.name, form.value.title)
    loading.value = false
    menuOpen.value = false
    emit('added') 
}
</script>