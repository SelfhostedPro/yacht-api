import { defineStore } from "pinia"
import { Ref, ref } from "vue"
import { useNotifyStore } from "./notifications"
import { useFetch, useStorage } from "@vueuse/core"
import { router } from "@/plugins"
import { useAuthFetch } from "@/helpers/auth/fetch"

export const useAuthStore = defineStore('auth', () => {
    const user: Ref<any> = ref(localStorage.getItem('user'))
    const returnUrl: Ref<string> = ref(null)
    const firstSetup: Ref<boolean> = ref(JSON.parse(localStorage.getItem('auth-disabled')))
    const authDisabled: Ref<boolean> = ref(JSON.parse(localStorage.getItem('auth-disabled')))
    const isLoading: Ref<Map<string, boolean>> = ref(new Map<'', false>)


    // >>>>> Actions <<<<<
    // Fetching API Data
    const userLogin = (async (creds) => {
        isLoading.value.set("login", true)
        const { isFetching, error, data } = await useFetch('/api/auth/login/').post(creds).json()
        isLoading.value.set("login", isFetching.value)
        if (!error.value) {
            user.value = data.value.username
            console.log(data.value)
            useStorage('user', await user.value)
            router.push(returnUrl.value || '/')
        } else { console.log(error.value)}
    })

    const refresh = (async () => {
        const {error, data} = await useFetch('/api/auth/refresh').json()
        if (!error.value && !data.value['statusCode']) {
            console.log(`refreshed token for ${user.value}`)
        } else {
            return data.value
        }
    })

    const userRegister = (async (creds) => {
        isLoading.value.set("register", true)
        const { isFetching, error, data } = await useAuthFetch('/api/setup-wizard/create-first-user').post(creds).json()
        isLoading.value.set("login", isFetching.value)
        if (!error.value) {
            user.value = data.value
            useStorage('first-setup', false)
            localStorage.removeItem('auth-token')
            delete data.value.admin
            userLogin(data.value)
        }
    })

    const authCheck = (async () => {
        isLoading.value.set("init", true)
        const { error } = await useFetch('/auth/noaut').post()
        if (error.value) {
            const { error, data } = await useFetch<string>('/api/setup-wizard/get-setup-wizard-token')
            if (!error.value) {
                useStorage('first-setup', true)
                firstSetup.value = true

                useStorage('auth-disabled', false)
                authDisabled.value = false

                useStorage('auth-token', JSON.parse(data.value)['access_token'])
            } else {
                useStorage('first-setup', false)
                useStorage('auth-disabled', false)
                firstSetup.value = false
                authDisabled.value = false
            }
        } else {
            useStorage('first-setup', false)
            useStorage('auth-disabled', true)
            firstSetup.value = false
            authDisabled.value = true
        }
    })

    const logOut = (async (path?: string, reason?: string) => {
        const notify = useNotifyStore()
        isLoading.value.clear()
        localStorage.removeItem('user')
        user.value = ref(undefined)
        if (path) {
            returnUrl.value = path
        }
        await router.push('/login')
        notify.setError(reason)
    })
    return { userLogin, user, returnUrl, isLoading, authCheck, firstSetup, authDisabled, userRegister, logOut, refresh }
})