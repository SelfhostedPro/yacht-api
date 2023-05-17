import { fromEvent } from 'rxjs';
import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvent } from '@yacht/types'

@Injectable()
export class NotificationsService {
    constructor(private notifications: EventEmitter2) { }
    debug(message: string) {
        if (process.env.DEBUG === '1') {
            this.notifications.emit('message', { data: { message: message, level: 'debug', timeout: -1 } } as NotificationEvent)
        }
    }
    info(message: string) {
        this.notifications.emit('message', { data: { message: message, level: 'info', timeout: -1 } } as NotificationEvent)
    }
    warn(message: string) {
        this.notifications.emit('message', { data: { message: message, level: 'warn', timeout: -1 } } as NotificationEvent)
    }
    error(message: string) {
        this.notifications.emit('message', { data: { message: message, level: 'error', timeout: -1 } } as NotificationEvent)
    }
    success(message: string) {
        this.notifications.emit('message', { data: { message: message, level: 'success', timeout: -1 } } as NotificationEvent)
    }
    getStream() {
        return fromEvent(this.notifications, 'message')
    }
}
