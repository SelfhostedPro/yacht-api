import { defineStore } from "pinia"
import { Notification } from "@/types/ui"

export const useNotifyStore = defineStore('notify', {
    state: () => ({
        notification:  JSON.parse(localStorage.getItem('notification')) as Notification || { content: '' } as Notification,
    }),
    getters: {
        getNotification: (state) => state.notification,
    },
    actions: {
        async setError(error: string) {
            this.notification.content = error
            this.notification.location = "bottom"
            this.notification.color = "red-accent-4"
            this.notification.btnColor = "white"
            this.notification.btnIcon = "mdi-close-circle"
            this.notification.timeout = -1
            this.notification.visible = true
            this.useStorage('notification', this.notification)
        },
        $reset() {
            localStorage.removeItem('notification')
            this.notification = {
                content: ""
            }
        }
    }
})