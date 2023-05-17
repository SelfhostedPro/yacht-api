import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import * as color from 'bash-color';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  @Inject(NotificationsService) private notificationsService: NotificationsService
  constructor(
  ) {
    super()
  }

  private get prefix() {
    return (
      color.cyan(`[${this.context || 'Server'}] `) +
      color.white(`[${new Date().toLocaleString()}]`)
    );
  }

  log(...args) {
    console.log(this.prefix, ...args.map((x) => color.blue(x)));
  }

  error(...args) {
    this.notificationsService.error(args.toString())
    console.error(this.prefix, ...args.map((x) => color.red(x)));
  }

  warn(...args) {
    this.notificationsService.warn(args.toString())
    console.warn(this.prefix, ...args.map((x) => color.yellow(x)));
  }

  success(...args) {
    console.log(this.prefix, ...args.map((x) => color.green(x)));
  }

  debug(...args) {
    if (process.env.DEBUG === '1') {
      console.debug(this.prefix, ...args.map((x) => color.green(x)));
    }
  }
  verbose(...args) {
    console.debug(this.prefix, ...args);
  }
}
