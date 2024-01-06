import { fromEvent } from 'rxjs';
import { Injectable, Scope } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvent } from '@yacht/types'
@Injectable({ scope: Scope.TRANSIENT })
export class NotificationsService {
    constructor(private eventEmitter: EventEmitter2) {
    }
    debug(message: string) {
        if (process.env.DEBUG === '1') {
            this.eventEmitter.emit('message', { data: { message: message, level: 'debug', timeout: -1 } } as NotificationEvent)
        }
    }
    info(message: string) {
        this.eventEmitter.emit('message', { data: { message: message, level: 'info', timeout: -1 } } as NotificationEvent)
    }
    warn(message: string) {
        this.eventEmitter.emit('message', { data: { message: message, level: 'warn', timeout: -1 } } as NotificationEvent)
    }
    error(message: string) {
        this.eventEmitter.emit('message', { data: { message: message, level: 'error', timeout: -1 } } as NotificationEvent)
    }
    success(message: string) {
        this.eventEmitter.emit('message', { data: { message: message, level: 'success', timeout: -1 } } as NotificationEvent)
    }
    // getStream() {
    //     return fromEvent(this.eventEmitter, 'message')
    // }
}
