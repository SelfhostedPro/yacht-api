// import { Container, ServerContainers, YachtContainerStats } from "@yacht/types"
import { defineStore } from "pinia"
import { useAuthFetch } from "@/helpers/auth/fetch"
import { useLoadingStore } from "@/stores/loading"
import { NewServer, YachtConfig } from "@yacht/types"

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        servers: {} as YachtConfig['base']['servers'],
        settings: {} as YachtConfig,
        keys: [] as string[],
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
                loadingStore.stopLoadingItem('settings')
            }
        },
        async fetchKeys() {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('keys')
            const { error, data } = await useAuthFetch<string>(`/api/settings/keys`).json()
            if (!error.value) {
                this.keys = data.value
                loadingStore.stopLoadingItem('keys')
            }
        },
        async addServer(form: NewServer) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('servers')
            const { error, data } = await useAuthFetch<string>(`/api/servers/`).post(form).json()
            if (!error.value) {
                this.servers = data.value
                loadingStore.stopLoadingItem('servers')
            }
        },
        async removeServer(name: string, removeRemoteKey: boolean, removeLocalKey: boolean) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('servers')
            const { error, data } = await useAuthFetch<string>(`/api/servers/`).delete({ name, removeRemoteKey, removeLocalKey }).json()
            if (!error.value) {
                this.servers = data.value
                loadingStore.stopLoadingItem('servers')
            }
        }
    }
})