import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import * as color from 'bash-color';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  constructor(
    private readonly notificationsService: NotificationsService,
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
    this.notificationsService.error(args.join(' '))
    console.error(this.prefix, ...args.map((x) => color.red(x)));
  }

  warn(...args) {
    console.warn(this.prefix, ...args.map((x) => color.yellow(x)));
  }

  success(...args) {
    this.notificationsService.success(args.join(' '))
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
