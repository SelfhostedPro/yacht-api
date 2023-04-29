import { defineStore } from "pinia"
import { useNotifyStore } from "@/stores/notifications"
import { useFetch, useStorage } from "@vueuse/core"
import { router } from "@/plugins"
import { useAuthFetch } from "@/helpers/auth/fetch"

interface LoginCreds {
    username: string,
    password: string,
    admin?: boolean
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: localStorage.getItem('user') as string || null,
        returnUrl: localStorage.getItem('returnUrl') as string || null,
        firstSetup: JSON.parse(localStorage.getItem('first-setup')) as boolean || null,
        authDisabled: JSON.parse(localStorage.getItem('auth-disabled')) as boolean || null,
    }),
    getters: {},
    actions: {
        async userLogin(creds: LoginCreds) {
            const { error, data } = await useFetch('/api/auth/login/').post(creds).json()
            if (!error.value) { 
                useStorage('user', await data.value.username)
                this.user = await data.value.username
                router.push(this.returnUrl || '/')
            }
        },
        async refresh() {
            const {error, data} = await useFetch('/api/auth/refresh').json()
            if (!error.value && !data.value['statusCode']) {
                console.log(`refreshed token for ${this.user.value}`)
            } else {
                await this.logOut(router.options.history.location)
            }
        },
        async userRegister(creds: LoginCreds) {
            const { error, data } = await useAuthFetch('/api/setup-wizard/create-first-user').post(creds).json()
            if (!error) {
                useStorage('first-setup', false)
                localStorage.removeItem('auth-token')
                delete data.value.admin
                this.user = data.value
                router.push('/login')
            }
        },
        async authCheck() {
            const { error } = await useFetch('/auth/noaut').post()
            if (error.value) {
                const { error, data } = await useFetch<string>('/api/setup-wizard/get-setup-wizard-token')
                if (!error.value) {
                    useStorage('first-setup', true)
                    this.firstSetup = true
    
                    useStorage('auth-disabled', false)
                    this.authDisabled = false
    
                    useStorage('auth-token', JSON.parse(data.value)['access_token'])
                } else {
                    useStorage('first-setup', false)
                    useStorage('auth-disabled', false)
                    this.firstSetup = false
                    this.authDisabled = false
                }
            } else {
                useStorage('first-setup', false)
                useStorage('auth-disabled', true)
                this.firstSetup = false
                this.authDisabled = true
            }
        },
        async logOut(path?: string, reason?: string) {
            const notify = useNotifyStore()
            localStorage.removeItem('user')
            this.user = null
            if (path) {
                this.returnUrl = path
            }
            useStorage('returnUrl', this.returnUrl)
            await router.push('/login')
            notify.setError(reason)
        }
    }
})