// import { Container, ServerContainers, YachtContainerStats } from "@yacht/types"
import { defineStore } from "pinia"
import { useAuthFetch } from "@/helpers/auth/fetch"
import { useLoadingStore } from "@/stores/loading"
import { YachtTemplate } from "@yacht/types"

interface State {
    templates: YachtTemplate[]
}

export const useTemplateStore = defineStore('templates', {
    state: (): State => ({
        templates: [] as YachtTemplate[],
    }),
    getters: {
        getTemplates: (state) => state.templates,
        getTemplate: (state) => (name: string) => state.templates.find((template) => template.name === name)
    },
    actions: {
        async fetchTemplates() {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('templates')
            const { error, data } = await useAuthFetch<string>(`/api/templates/`).json()
            if (!error.value) {
                this.templates = data.value
                loadingStore.stopLoadingItem('templates')
            }
        },
        async addTemplate(url: string, name: string, title?: string) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('templates')
            const { error, data } = await useAuthFetch<string>(`/api/templates/`).post({ url, name, title }).json()
            if (!error.value) {
                this.templates.push(data.value)
                loadingStore.stopLoadingItem('templates')
            }
        },
        async deleteTemplate(name: string) {
            const loadingStore = useLoadingStore()
            loadingStore.startLoadingItem('templates')
            const { error } = await useAuthFetch<string>(`/api/templates/${name}`).delete().json()
            if (!error.value) {
                this.templates.splice(this.templates.findIndex((template) => template.name === name), 1)
                loadingStore.stopLoadingItem('templates')
            }
        }
    }
})