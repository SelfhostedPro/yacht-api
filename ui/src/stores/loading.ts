import { defineStore } from "pinia"
import { Ref, ref } from "vue"

interface Loading {
    loading: boolean,
}

export const useLoadingStore = defineStore('loading', () => {
    const loading: Ref<Loading> = ref({loading: false})

    const startLoading = async () => {
        loading.value = {loading: true}
    }

    const stopLoading = async () => {
        loading.value = {loading: false}
    }

    return { loading, startLoading, stopLoading }
})