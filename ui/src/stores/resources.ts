// import { Container, ServerContainers, YachtContainerStats } from "@yacht/types"
import { defineStore } from "pinia"
import { useAuthFetch } from "@/helpers/auth/fetch"
import { useLoadingStore } from "@/stores/loading"
import { NetworkInspectInfo, ImageInspectInfo, VolumeInspectInfo } from "dockerode"
import { ServerImages, ServerNetworks, ServerVolumes } from "@yacht/types"

export const useResourceStore = defineStore('resources', {
    state: () => ({
        networks: {} as ServerNetworks,
        images: {} as ServerImages,
        volumes: {} as ServerVolumes
    }),
    getters: {
        getNetworks: (state) => state.networks,
        getNetwork: (state) => (serverName: string, idOrName: string) => state.networks[serverName].find((network) => network.Id === idOrName || network.Name === idOrName),
        getImages: (state) => state.images,
        getImage: (state) => (serverName: string, idOrName: string) => state.images[serverName].find((image) => image.Id === idOrName || image.RepoTags.includes(idOrName)),
        getVolumes: (state) => state.volumes,
        getVolume: (state) => (serverName: string, idOrName: string) => state.volumes[serverName].find((volume) => volume.Name === idOrName),
    },
    actions: {
        async setResource(serverName: string, data: NetworkInspectInfo | ImageInspectInfo | VolumeInspectInfo, resource: 'networks' | 'images' | 'volumes') {
            const idx = this[resource][serverName].findIndex((resource: NetworkInspectInfo | ImageInspectInfo | VolumeInspectInfo) => [resource]['Id'] === data['Id'] || [resource]['Name'] === data['Name']) 
            if (idx < 0) {
                this.apps.push(data)
            } else {
                this.apps[idx] = data
            }
        },
        async fetchResources(resource: 'networks' | 'images' | 'volumes') {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem(resource)
            const { error, data } = await useAuthFetch<string>(`/api/resources/${resource}/`).json()
            if (!error.value) {
                this[resource] = data.value
                loadingStore.stopLoadingItem(resource)
            }
        },
        async fetchResource(resource: 'networks' | 'images' | 'volumes', serverName: string, idOrName: string) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem(resource)
            const { error, data } = await useAuthFetch<string>(`/api/resources/${resource}/${serverName}/${idOrName}`).json()
            if (!error.value) {
                if (!this[resource] || !this[resource][serverName]) {
                    await this.fetchResource(resource)
                }
                this.setResource(serverName, data.value, resource)
                loadingStore.stopLoadingItem(resource)
            }
        },
    }
})