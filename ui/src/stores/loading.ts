import { defineStore } from "pinia"

interface isLoading {
    loading: boolean,
    items: Map<string, boolean>
}

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isLoading: { loading: false, items: new Map() } as isLoading
    }),
    getters: {
        getLoading: (state) => state.isLoading,
        getLoadingItems: (state) => state.isLoading.items,
        getLoadingItem: (state) => (item: string) => state.isLoading.items.get(item),
    },
    actions: {
        async startLoading() {
            this.isLoading.loading = true
            
        },
        async startLoadingItem(item: string) {
            this.isLoading.loading = true
            this.isLoading.items.set(item, true)
        },
        async stopLoadingItem(item: string) {
            this.isLoading.items.delete(item)
            if (this.isLoading.items.size === 0) {
                this.isLoading.loading = false
            }
        },
        async stopLoading() {
            this.isLoading.loading = false
        }
    }
})
