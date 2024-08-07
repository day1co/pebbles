import type { LogLevel } from './logger.type';

export interface Logger {
  set logLevel(level: LogLevel);
  trace(msgTemplate?: string, ...args: unknown[]): void;
  debug(msgTemplate?: string, ...args: unknown[]): void;
  info(msgTemplate?: string, ...args: unknown[]): void;
  warn(msgTemplate?: string, ...args: unknown[]): void;
  error(msgTemplate?: string, ...args: unknown[]): void;
  log(msgTemplate?: string, ...args: unknown[]): void;
}

export interface ObjectLogger {
  traceObject(o: object, msg: string): void;
  debugObject(o: object, msg: string): void;
  infoObject(o: object, msg: string): void;
  warnObject(o: object, msg: string): void;
  errorObject(o: object, msg: string): void;
  logObject(o: object, msg: string): void;
}
