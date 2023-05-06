import { Container, CreateContainerForm, ServerContainers, YachtContainerStats } from "@yacht/types"
import { defineStore } from "pinia"
import { useEventSource } from "@vueuse/core"
import { useAuthFetch } from "@/helpers/auth/fetch"
import { useLoadingStore } from "@/stores/loading"

export const useAppStore = defineStore('apps', {
    state: () => ({
        apps: {} as ServerContainers,
        stats: {} as YachtContainerStats,
        openStats: null as EventSource
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
            }
        },
        async createApp(form: CreateContainerForm) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('deploy')
            const {error,data} = await useAuthFetch<any>(`/api/containers/create`).post(form).json()
            if (!error.value) {
                this.setApp(form.server, data.value)
                loadingStore.stopLoadingItem('app')
            }
        },
        async fetchStats() {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('stats')
            const { eventSource, error } = useEventSource(`/api/containers/stats`, ['message'], { withCredentials: true })
            if (!error.value) {
                eventSource.value.onopen = () => {
                    loadingStore.stopLoadingItem('stats')
                }
                eventSource.value.addEventListener('message', (message) => {
                    if (eventSource.value.OPEN) {
                        const stat = JSON.parse(message.data)
                        this.stats[stat.Name] = JSON.parse(message.data)
                    }
                })
                // Assign openStats to eventSource so we can close it later
                this.openStats = eventSource.value
            }
        },
        async fetchAppAction(server: string | number, id: string, action: string) {
            const loading = useLoadingStore()
            loading.startLoadingItem('app')
            const { error, data } = await useAuthFetch<Container>(`/api/containers/actions/${server}/${id}/${action}`).json()
            loading.stopLoading()
            if (!error.value) {
                this.setApp(data.value)
                loading.stopLoadingItem('app')
            }
        }
    }
})