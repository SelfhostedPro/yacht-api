import { defineStore } from "pinia"
import { useEventSource, useStorage } from "@vueuse/core"
import { NotificationEvent } from '@yacht/types'
import { Anchor } from "@/types/ui"

const NotificationTypes = {
    error: {
        color: "red-accent-4",
    },
    success: {
        color: "green",
    },
    info: {
        color: "blue",
    },
    warn: {
        color: "yellow",
    },
    debug: {
        color: "blue",
    }
}

class Notification {
    color: string
    content: string
    timeout: number
    visible: boolean
    constructor(
        public event: NotificationEvent['data'],
        public location?: Anchor,
        public btnColor?: string,
        public btnIcon?: string,
    ) {
        this.color = NotificationTypes[event.level].color
        this.content = event.message
        this.timeout = event.timeout || 5000
        this.visible = true
        this.location = location || "bottom"
        this.btnColor = btnColor || "white"
        this.btnIcon = btnIcon || 'mdi-close-circle'
    }
}

export const useNotifyStore = defineStore('notify', {
    state: () => ({
        notifications: JSON.parse(localStorage.getItem('notifications')) as Notification[] || [] as Notification[],
        retries: 0,
    }),
    getters: {
        getNotifications: (state) => state.notifications,
    },
    actions: {
        async setError(error: string) {
            this.notifications.push(new Notification({ message: error, level: 'error', timeout: -1 }))
            localStorage.setItem('notifications', JSON.stringify(this.notifications))
        },
        async clearNotification(idx: number) {
            this.notifications.splice(idx, 1)
            localStorage.setItem('notifications', JSON.stringify(this.notifications))
        },
        async listenToNotifications() {
            this.retries = 0
            const { eventSource, error } = useEventSource(`/api/notifications`, ['message'], { withCredentials: true })
            if (!error.value) {
                eventSource.value.addEventListener('message', (event) => {
                    this.notifications.push(new Notification(JSON.parse(event.data)));
                    const test: Notification[] = this.notifications
                });
            } else {
                console.log(`Notification sse error ${error.value}`)
            }
        },
        $reset() {
            localStorage.removeItem('notification')
            this.notifications = [] as Notification[]
        }
    }
})