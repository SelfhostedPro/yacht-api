import { useAuthStore } from "@/stores/auth";
import { useNotifyStore } from "@/stores/notifications";
import { createFetch, useFetch } from "@vueuse/core";
import { fetchEventSource } from '@microsoft/fetch-event-source'


export const useAuthFetch = createFetch({
    options: {
        async beforeFetch({ options }) {
            const token = localStorage.getItem('auth-token')
            if (token) {
                options.headers['Authorization'] = `Bearer ${token}`
            }
            return { options }
        },
        async onFetchError(ctx) {
            const data = ctx.data
            console.log(data)
            const authStore = useAuthStore()
            if (data['statusCode'] === 401) {
                await authStore.refresh()
                const { data, response, error } = await useFetch(ctx.response.url).json()
                return { data: data.value, response: response.value, error: error.value }
            } else {
                const notify = useNotifyStore()
                notify.setError(`${ctx.data.statusCode}: ${ctx.data.message}`)
            }
            return ctx
        },
    }
})

export async function useEventSource(url, options) {
    return fetchEventSource(url, {
        async onopen(response) {
            if (response.ok) {
                return
            } else if (response.status === 401) {
                const authStore = useAuthStore()
                try {
                    authStore.refresh()
                } catch (e) {
                    throw new Error(e)
                }
            } else {
                throw new Error(`${response.status}: ${response.statusText}`)
            }
        },
        ...options
    })
}