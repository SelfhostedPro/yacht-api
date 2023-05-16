import { ConsoleLogger } from '@nestjs/common';
import * as color from 'bash-color';

export class Logger extends ConsoleLogger {
  moduleName: string;
  constructor(moduleName?: string) {
    super(moduleName);
    this.moduleName = moduleName || 'Yacht';
  }

  private get prefix() {
    return (
      color.cyan(`[${this.moduleName}] `) +
      color.white(`[${new Date().toLocaleString()}]`)
    );
  }

  log(...args) {
    console.log(this.prefix, ...args.map((x) => color.blue(x)));
  }

  error(...args) {
    console.error(this.prefix, ...args.map((x) => color.red(x)));
  }

  warn(...args) {
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
