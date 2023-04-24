import { defineStore } from "pinia"
import { Ref, computed, ref } from "vue"
import { Notification } from "@/types/ui"
import { useStorage } from "@vueuse/core"


export const useNotifyStore = defineStore('notify', () => {
    const notification: Ref<Notification> = ref(JSON.parse(localStorage.getItem('notification')) || { content: '' })

    const setError = ((error: string) => {
        notification.value.content = error
        notification.value.location = "bottom"
        notification.value.color = "red-accent-4"
        notification.value.btnColor = "white"
        notification.value.btnIcon = "mdi-close-circle"
        notification.value.timeout = -1
        notification.value.visible = true
        useStorage('notification', notification)
    })

    const getNotification = computed(() => {
        return notification.value
    })

    // Clean up
    const notificationReset = (() => {
        localStorage.removeItem('notification')
        notification.value = {
            content: ""
        }
    })
    return { notification, setError, getNotification, notificationReset }
})