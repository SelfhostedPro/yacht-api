import { useAuthStore } from "@/stores/auth";
import { useNotifyStore } from "@/stores/notifications";
import { createFetch } from "@vueuse/core";


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
            const authStore = useAuthStore()
            if (data['statusCode'] === 401) {
                await authStore.refresh()
                const { data, response, error } = await useAuthFetch(ctx.response.url).json()
                return { data: data.value, response: response.value, error: error.value }
            } else {
                const notify = useNotifyStore()
                notify.setError(`${ctx.data.statusCode}: ${ctx.data.message}`)
            }
            return ctx
        },
    }
})
