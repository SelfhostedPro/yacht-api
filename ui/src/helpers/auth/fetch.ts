import { useAuthStore } from "@/stores/auth";
import { useNotifyStore } from "@/stores/notifications";
import { createFetch } from "@vueuse/core";


export const useAuthFetch = createFetch({
    options: {
        async beforeFetch({ options }) {
            const token = localStorage.getItem('auth-token')
            if (token) {
                options.headers.Authorization = `Bearer ${token}`
            }
            return { options }
        },
        async onFetchError(ctx) {
            const data = JSON.parse(ctx.data)
            const authStore = useAuthStore()
            if (data['statusCode'] === 401 || data['statusCode'] === 403) {
                const error = await authStore.refresh()
                if (!await error) {
                    const { data, response, error } = await useAuthFetch(ctx.response.url)
                    return { data: data.value, response: response.value, error: error.value }
                } else {
                    authStore.logOut()
                }
            }
            const notify = useNotifyStore()
            notify.setError(`${JSON.parse(ctx.data).statusCode}: ${JSON.parse(ctx.data).message}`)
            return ctx
        },
    }
})
