import { defineStore } from "pinia"
import { Ref, ref } from "vue"
import { useFetch, } from "@vueuse/core"

export const useAuthStore = defineStore('auth', () => {
    const settings: Ref<any> = ref(JSON.parse(localStorage.getItem('settings')))
    const isLoading: Ref<Map<string, boolean>> = ref(new Map<'', false>)


    // >>>>> Actions <<<<<
    // Get initial settings
    const initCheck = (async () => {
        isLoading.value.set("init", true)
        const { isFetching, error, data } = await useFetch('/auth/settings/').get()
        isLoading.value.set("init", isFetching.value)
        if (!error.value) {
            settings.value = data.value
            localStorage.setItem('settings', settings.value)
        }
    })
    return { initCheck, isLoading }
})