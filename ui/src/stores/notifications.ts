import { defineStore } from "pinia"
import { useEventSource, useStorage } from "@vueuse/core"
import { NotificationEvent } from '@yacht/types'
import { Anchor } from "@/types/ui"
import { toRaw } from "vue"

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
    notificationStream: EventSource | null
}

export const useNotifyStore = defineStore('notify', {
    state: (): State => ({
        notifications: [] as Notification[],
        retries: 0,
        notificationStream: null as EventSource,

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
            const newError = new Notification({ message: error, level: 'error', timeout: -1 })
            if (!this.notifications.contains(newError)) {
                this.notifications.push(newError);
                localStorage.setItem('notifications', JSON.stringify(this.notifications));
            }
        },
        async clearNotification(idx: number) {
            this.notifications.splice(idx, 1)
            localStorage.setItem('notifications', JSON.stringify(this.notifications))
        },
        async listenToNotifications() {
            this.retries = 0
            const { eventSource, error } = useEventSource(`/api/notifications`, ['message'], { withCredentials: true })
            if (!error.value) {
                this.notificationStream = eventSource.value
                eventSource.value.addEventListener('message', async (event: MessageEvent<string>) => {
                    this.setNotification(new Notification(JSON.parse(event.data)))
                });
            } else {
                console.log(`Notification sse error ${error.value}`)
            }
        },
        async close() {
            this.notificationStream?.close()
        },
        $reset() {
            this.notificationStream?.close()
            localStorage.removeItem('notification')
            this.notifications = [] as Notification[]
        }
    }
})