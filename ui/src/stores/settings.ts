import { defineStore } from "pinia"
import { Ref, computed, ref } from "vue"
import { useNotifyStore } from "./notifications"
import { useFetch, useStorage } from "@vueuse/core"
import { router } from "@/plugins"

export const useAuthStore = defineStore('auth', () => {
    const user: Ref<any> = ref(JSON.parse(localStorage.getItem('user')))
    const returnUrl: Ref<string> = ref(null)
    const isLoading: Ref<Map<string, boolean>> = ref(new Map<'', false>)


    // >>>>> Actions <<<<<
    // Fetching API Data
    const userLogin = (async (creds) => {
        isLoading.value.set("login", true)
        const { isFetching, error, data } = await useFetch('/auth/login/').post(creds).text()
        isLoading.value.set("login", isFetching.value)
        if (!error.value) {
            user.value = data.value
            localStorage.setItem('user', user.value)
            router.push(returnUrl.value || '/')
        }
    })
    return { userLogin, user, returnUrl, isLoading }
})