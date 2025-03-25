import pino from 'pino';
import type { Logger } from '../logger.interface';
import type { LogLevel } from '../logger.type';

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger;

  constructor(name: string);
  constructor(args: Record<string, unknown>, logger: pino.Logger);
  constructor(nameOrArgs: string | Record<string, unknown>, logger?: pino.Logger) {
    if (typeof nameOrArgs === 'string') {
      this.logger = pino({ name: nameOrArgs, level: 'debug' });
    } else if (typeof nameOrArgs === 'object' && logger) {
      this.logger = logger.child(nameOrArgs);
    } else {
      throw new Error('Invalid arguments');
    }
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

  child(args: Record<string, unknown>): Logger {
    return new PinoLogger(args, this.logger);
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  flat(msgTemplate: string = '', args: Record<string, unknown>): void {
    this.logger.child(args).debug(msgTemplate);
  }

  log = this.debug;
}
