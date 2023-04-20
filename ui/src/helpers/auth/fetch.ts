import { useAuthStore } from "@/stores/auth";
import { useNotifyStore } from "@/stores/notifications";
import { createFetch, useStorage } from "@vueuse/core";


export const useAuthFetch = createFetch({
    options: {
        async beforeFetch({ options }) {
            const token = localStorage.getItem('auth-token')
            if (token) {
                options.headers.Authorization = `Bearer ${token}`
            }
            return { options }
        },
        async onFetchError({ data }) {
            const authStore = useAuthStore()
            authStore.logOut
            const notify = useNotifyStore()
            notify.setError(`${JSON.parse(data).statusCode}: ${JSON.parse(data).message}`)

            return { data }
        }
    }
})
