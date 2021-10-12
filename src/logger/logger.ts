import pino from 'pino';
import type { AbstractLogger } from './logger.interface';
import { LogLevel } from './logger.type';

export class Logger implements AbstractLogger {
  private readonly logger: pino.Logger;

  constructor(name: string) {
    this.logger = pino({ name, level: 'debug' });
  }

  set logLevel(level: LogLevel) {
    this.logger.level = level;
  }

  debug(msgTemplate: string, ...args: unknown[]): void {
    this.logger.debug(msgTemplate, ...args);
  }

  info(msgTemplate: string, ...args: unknown[]): void {
    this.logger.info(msgTemplate, ...args);
  }

  warn(msgTemplate: string, ...args: unknown[]): void {
    this.logger.warn(msgTemplate, ...args);
  }

  error(msgTemplate: string, ...args: unknown[]): void {
    this.logger.error(msgTemplate, ...args);
  }
}
