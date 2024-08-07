import pino from 'pino';
import type { Logger, ObjectLogger } from '../logger.interface';
import type { LogLevel } from '../logger.type';

export class PinoLogger implements Logger, ObjectLogger {
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

  traceObject(o: object = {}, msg: string = ''): void {
    this.logger.child(o).trace(msg);
  }

  debugObject(o: object = {}, msg: string = ''): void {
    this.logger.child(o).debug(msg);
  }

  infoObject(o: object = {}, msg: string = ''): void {
    this.logger.child(o).debug(msg);
  }

  warnObject(o: object = {}, msg: string = ''): void {
    this.logger.child(o).debug(msg);
  }

  errorObject(o: object = {}, msg: string = ''): void {
    this.logger.child(o).debug(msg);
  }

  log = this.debug;
  logObject = this.debugObject;
}
