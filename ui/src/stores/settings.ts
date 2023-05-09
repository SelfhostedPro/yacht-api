// import { Container, ServerContainers, YachtContainerStats } from "@yacht/types"
import { defineStore } from "pinia"
import { useAuthFetch } from "@/helpers/auth/fetch"
import { useLoadingStore } from "@/stores/loading"
import { YachtConfig } from "@yacht/types"

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        servers: {} as YachtConfig['base']['servers'],
        settings: {} as YachtConfig,
    }),
    getters: {
        getServers: (state) => state.servers,
    },
    actions: {
        async fetchServers() {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('servers')
            const { error, data } = await useAuthFetch<string>(`/api/servers/`).json()
            if (!error.value) {
                this.servers = data.value
                loadingStore.stopLoadingItem('servers')
            }
        },
        async fetchSettings() {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('settings')
            const { error, data } = await useAuthFetch<string>(`/api/settings/`).json()
            if (!error.value) {
                this.settings = data.value
                loadingStore.stopLoadingItem('servers')
            }
        }
    }
})