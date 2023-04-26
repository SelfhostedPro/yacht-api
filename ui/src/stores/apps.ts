import { ReadableContainerDetails, ReadableContainerInfo, ReadableContainerStats } from "@/types/apps"
import { defineStore } from "pinia"
import { Ref, computed, ref } from "vue"
import { useEventSource } from "@vueuse/core"
import { useAuthFetch } from "@/helpers/auth/fetch"

export const useAppStore = defineStore('apps', () => {
    const apps: Ref<ReadableContainerInfo[]> = ref([])
    const appDetails: Ref<ReadableContainerDetails> = ref(null)
    const stats: Ref<ReadableContainerStats> = ref({})
    const isLoading: Ref<Map<string, boolean>> = ref(new Map<'', false>)
    const openStats: Ref<EventSource> = ref(null)

    // >>>>> Actions <<<<<
    // Fetching API Data
    const fetchApps = (async () => {
        isLoading.value.set("fetchApps", true)
        const { isFetching, error, data } = await useAuthFetch<string>(`/api/containers/`)
        isLoading.value.set("fetchApps", isFetching.value)
        if (!error.value) {
            apps.value = JSON.parse(data.value)
        }
    })
    const fetchAppDetails = (async (Id) => {
        isLoading.value.set("fetchAppDetails", true)
        const { isFetching, error, data } = await useAuthFetch<string>(`/api/containers/info/${Id}`)
        isLoading.value.set("fetchAppDetails", isFetching.value)
        if (!error.value) {
            appDetails.value = JSON.parse(data.value)
        }
    })
    const fetchStats = (async () => {
        isLoading.value.set("fetchStats", true)
        const { eventSource } = useEventSource(`/api/containers/stats`, ['message'], {withCredentials: true})
        eventSource.value.onopen = () => {
            isLoading.value.set("fetchStats", false)
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
        isLoading.value.set("appAction", true)
        const { isFetching, error, data } = await useAuthFetch<string>(`/api/containers/actions/:id/:action`)
        isLoading.value.set("appAction", isFetching.value)
        if (!error.value) {
            fetchAppDetails(id)
        }
    })


    // >>>>> Clean Up <<<<<
    function resetApps() {
        apps.value = []
        stats.value = {}
        isLoading.value.clear()
        openStats.value.close()
        openStats.value = null
    }
    function resetAppDetails() {
        isLoading.value.clear()
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
    const getIsLoading = computed(() => {
        return isLoading.value
    })


    return { apps, getApps, fetchApps, stats, getStats, fetchStats, isLoading, getIsLoading, appDetails, getAppDetails, fetchAppDetails, resetApps, resetAppDetails, appAction }
})