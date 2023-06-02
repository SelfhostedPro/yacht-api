import { Container, CreateContainerForm, ServerContainers, YachtContainerStats } from "@yacht/types"
import { defineStore } from "pinia"
import { useEventSource } from "@/helpers/auth/fetch"
import { useAuthFetch } from "@/helpers/auth/fetch"
import { useLoadingStore } from "@/stores/loading"
import { useNotifyStore } from "./notifications"

export const useAppStore = defineStore('apps', {
    state: () => ({
        apps: {} as ServerContainers,
        stats: {} as YachtContainerStats,
        openStatsController: new AbortController(),
        retries: 0,
    }),
    getters: {
        getApp: (state) => (serverName: string, idOrName: string) => state.apps[serverName].find((app) => app.id === idOrName || app.name === idOrName),
        getApps: (state) => state.apps,
        getStats: (state) => state.stats,
    },
    actions: {
        async setApp(serverName: string, data: Container) {
            const idx = this.apps[serverName].findIndex((app: Container) => app.id === data.id)
            if (idx < 0) {
                this.apps[serverName].push(data)
            } else {
                this.apps[serverName][idx] = data
            }
        },
        async fetchApps() {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('apps')
            const { error, data } = await useAuthFetch<string>(`/api/containers/`).json()
            if (!error.value) {
                this.apps = data.value
                loadingStore.stopLoadingItem('apps')
            } else {
                const notify = useNotifyStore()
                loadingStore.stopLoadingItem('deploy')
                notify.setError(`${data.value.statusCode}: ${data.value.message}`)
                throw new Error
            }
        },
        async fetchApp(serverName: string, idOrName: string) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('app')
            if (!this.apps || !this.apps[serverName]) {
                await this.fetchApps()
            }
            const { error, data } = await useAuthFetch<Container>(`/api/containers/info/${serverName}/${idOrName}`).json()
            if (!error.value) {
                this.setApp(serverName, data.value)
                loadingStore.stopLoadingItem('app')
            } else {
                const notify = useNotifyStore()
                loadingStore.stopLoadingItem('deploy')
                notify.setError(`${data.value.statusCode}: ${data.value.message}`)
                throw new Error
            }
        },
        async createApp(form: CreateContainerForm) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('deploy')
            const { error, data } = await useAuthFetch<any>(`/api/containers/create`).post(form).json()
            if (!error.value) {
                this.setApp(form.server, data.value)
                loadingStore.stopLoadingItem('deploy')
                this.fetchApps()
            } else {
                const notify = useNotifyStore()
                loadingStore.stopLoadingItem('deploy')
                notify.setError(`${data.value.statusCode}: ${data.value.message}`)
                throw new Error
            }
        },
        async fetchStats() {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('stats')
            const self = this
            try {
                await useEventSource(`/api/containers/stats`, {
                    onerror(err) {
                        throw err
                    },
                    onmessage(msg) {
                        if (msg.data) {
                            const stat = JSON.parse(msg.data)
                            self.stats[stat.Name] = JSON.parse(msg.data)
                        } else {
                            loadingStore.stopLoadingItem('stats')
                        }
                    },
                    signal: self.openStatsController.signal
                })
            } catch (e) {
                console.log(e)
                const notify = useNotifyStore()
                loadingStore.stopLoadingItem('stats')
                notify.setError(`Stats Error: ${e}`)
            }
        },
        async fetchAppAction(server: string | number, id: string, action: string) {
            const loading = useLoadingStore()
            loading.startLoadingItem('app')
            const { error, data } = await useAuthFetch<Container>(`/api/containers/actions/${server}/${id}/${action}`).json()
            loading.stopLoading()
            if (!error.value) {
                this.setApp(server, data.value)
                loading.stopLoadingItem('app')
            }
        }
    }
})