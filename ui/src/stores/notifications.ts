import { defineStore } from "pinia"
import { NotificationEvent } from '@yacht/types'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useEventSource } from "@/helpers/auth/fetch"
import { Anchor } from "@/types/ui"
import { toRaw } from "vue"
import { useAuthStore } from "./auth"

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

interface State {
    notifications: Notification[]
    retries: number
    notificationStreamController: AbortController
}

export const useNotifyStore = defineStore('notify', {
    state: (): State => ({
        notifications: [] as Notification[],
        retries: 0,
        notificationStreamController: new AbortController(),

    }),
    getters: {
        getNotifications: (state) => state.notifications,
    },
    actions: {
        setNotification(message: Notification) {
            const existing: [] = toRaw(this.notifications)
            if (existing.some((n: Notification) => n.content === message.content)) {
                console.log(`supressing duplicate notification: ${message.content}`)
            } else {
                this.notifications.push(message);
                localStorage.setItem('notifications', JSON.stringify(this.notifications));
            }
        },
        async setError(error: string) {
            this.setNotification(new Notification({ message: error, level: 'error', timeout: -1 }))
        },
        async clearNotification(idx: number) {
            this.notifications.splice(idx, 1)
            localStorage.setItem('notifications', JSON.stringify(this.notifications))
        },
        async listenToNotifications() {
            this.retries = 0
            const { setNotification, setError } = this
            const signal = this.notificationStreamController.signal
            try {
                await useEventSource(`/api/notifications`, {
                    onerror(err) {
                        console.log(err)
                        setError(new Notification({ message: JSON.stringify(err), level: 'error' }))
                    },
                    onmessage(msg) {
                        if (msg.data) {
                            setNotification(new Notification(JSON.parse(msg.data)))
                        }
                    },
                    signal: signal
                })
            } catch (e) {
                setError(new Notification({ message: JSON.stringify(e), level: 'error' }))
            }

        },
        async close() {
            this.notificationStreamController.close()
        },
        $reset() {
            this.notificationStreamController.close()
            localStorage.removeItem('notification')
            this.notifications = [] as Notification[]
        }
    }
})