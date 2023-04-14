import { defineStore } from "pinia"
import { Ref, computed, ref } from "vue"
import { Notification } from "@/types/ui"


export const useNotifyStore = defineStore('notify', () => {
    const notification: Ref<Notification> = ref({
        content: "",
    })

    const setError = ((error: string) => {
        notification.value.content = error
        notification.value.location = "bottom"
        notification.value.color = "red-accent-4"
        notification.value.btnColor = "white"
        notification.value.btnIcon = "mdi-close-circle"
        notification.value.timeout = -1
        notification.value.visible = true
    })

    const getNotification = computed(() => {
        return notification.value
    })

    // Clean up
    const notificationReset = (() => {
        notification.value = {
            content: ""
        }
    })
    return {notification, setError, getNotification, notificationReset}
})