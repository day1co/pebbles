import pino from 'pino';
import type { Logger } from '../logger.interface';
import type { LogLevel } from '../logger.type';

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger;

  constructor(name: string) {
    this.logger = pino({ name, level: 'debug' });
  }

  set logLevel(level: LogLevel) {
    this.logger.level = level;
  }

  trace(msgTemplate = '', ...args: unknown[]): void {
    this.logger.trace(msgTemplate, ...args);
  }

  debug(msgTemplate = '', ...args: unknown[]): void {
    this.logger.debug(msgTemplate, ...args);
  }

  info(msgTemplate = '', ...args: unknown[]): void {
    this.logger.info(msgTemplate, ...args);
  }

  warn(msgTemplate = '', ...args: unknown[]): void {
    this.logger.warn(msgTemplate, ...args);
  }

  error(msgTemplate = '', ...args: unknown[]): void {
    this.logger.error(msgTemplate, ...args);
  }

  log = this.debug;
}
