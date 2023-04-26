import { Container, ReadableContainerStats } from "@/types/apps"
import { defineStore } from "pinia"
import { Ref, computed, ref } from "vue"
import { useEventSource } from "@vueuse/core"
import { useAuthFetch } from "@/helpers/auth/fetch"
import { useLoadingStore } from "./loading"

export const useAppStore = defineStore('apps', () => {
    const apps: Ref<Container[]> = ref([])
    const appDetails: Ref<Container> = ref(null)
    const stats: Ref<ReadableContainerStats> = ref({})
    const openStats: Ref<EventSource> = ref(null)

    // >>>>> Actions <<<<<
    // Fetching API Data
    const fetchApps = (async () => {
        const loading = useLoadingStore()
        loading.startLoading()
        const { isFetching, error, data } = await useAuthFetch<string>(`/api/containers/`)
        loading.stopLoading()
        if (!error.value) {
            apps.value = JSON.parse(data.value)
        }
    })
    const fetchAppDetails = (async (Id) => {
        const loading = useLoadingStore()
        loading.startLoading()
        const { isFetching, error, data } = await useAuthFetch<string>(`/api/containers/info/${Id}`)
        loading.stopLoading()
        if (!error.value) {
            appDetails.value = JSON.parse(data.value)
        }
    })
    const fetchStats = (async () => {
        const loading = useLoadingStore()
        loading.startLoading()
        const { eventSource } = useEventSource(`/api/containers/stats`, ['message'], {withCredentials: true})
        eventSource.value.onopen = () => {
            loading.stopLoading()
        }
        eventSource.value.addEventListener('message', (message) => {
            if (eventSource.value.OPEN) {
                const stat = JSON.parse(message.data)
                stats.value[stat.Name] = JSON.parse(message.data)
            }
        })
        // Assign openStats to eventSource so we can close it later
        openStats.value = eventSource.value
    })
    // Interact with containers
    const appAction = (async (id, action) => {
        const loading = useLoadingStore()
        loading.startLoading()
        const { isFetching, error, data } = await useAuthFetch<string>(`/api/containers/actions/:id/:action`)
        loading.stopLoading()
        if (!error.value) {
            fetchAppDetails(id)
        }
    })


    // >>>>> Clean Up <<<<<
    function resetApps() {
        apps.value = []
        stats.value = {}
        openStats.value.close()
        openStats.value = null
    }
    function resetAppDetails() {
        appDetails.value = null
    }

    // >>>>> Getters <<<<<
    const getApps = computed(() => {
        return apps.value
    })
    const getAppDetails = computed(() => {
        return appDetails.value
    })
    const getStats = computed(() => {
        return stats.value
    })


    return { apps, getApps, fetchApps, stats, getStats, fetchStats, appDetails, getAppDetails, fetchAppDetails, resetApps, resetAppDetails, appAction }
})