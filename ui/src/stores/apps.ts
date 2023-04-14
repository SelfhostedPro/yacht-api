import { ReadableContainerDetails, ReadableContainerInfo, ReadableContainerStats } from "@/types/apps"
import { Loading } from "@/types/ui"
import { defineStore } from "pinia"
import { Ref, computed, ref } from "vue"

export const useAppStore = defineStore('apps', () => {
    const apps: Ref<ReadableContainerInfo[]> = ref([])
    const appDetails: Ref<ReadableContainerDetails> = ref(null)
    const stats: Ref<ReadableContainerStats> = ref({})
    const isLoading: Ref<Map<string, boolean>> = ref(new Map<'', false>)

    const statSource = new EventSource(`/api/containers/stats`)
    // Actions
    const fetchApps = (async () => {
        isLoading.value.set("fetchApps", true)
        fetch('/api/containers')
            .then(response => response.json())
            .then(data => apps.value = data)
            .then(() => { isLoading.value.set("fetchApps", false) })
    })

    const fetchAppDetails = (async (Id) => {
        isLoading.value.set("fetchAppDetails", true)
        fetch(`/api/containers/info/${Id}`)
            .then(response => response.json())
            .then(data => appDetails.value = data)
            .then(() => { isLoading.value.set("fetchAppDetails", false) })
    })

    const fetchStats = (async () => {
        isLoading.value.set("fetchStats", true)
        statSource.addEventListener('message', (message) => {
            if (statSource.OPEN) {
                isLoading.value.set("fetchStats", false)
                const stat = JSON.parse(message.data)
                stats.value[stat.Name] = JSON.parse(message.data)
            }
        })
    })
    // Getters
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

    // Clean up
    function $reset() {
        apps.value = []
        stats.value = {}
        appDetails.value = null
        isLoading.value = new Map<'', false>
        statSource.close()
    }

    return { apps, getApps, fetchApps, stats, getStats, fetchStats, isLoading, getIsLoading, appDetails, getAppDetails, fetchAppDetails }
})