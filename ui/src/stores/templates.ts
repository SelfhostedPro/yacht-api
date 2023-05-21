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
    }
})