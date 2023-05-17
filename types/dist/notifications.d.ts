export interface Notification {
    message: string;
    level: 'debug' | 'info' | 'warn' | 'error' | 'success';
    timeout?: number;
}
export interface NotificationEvent {
    data: Notification;
}
