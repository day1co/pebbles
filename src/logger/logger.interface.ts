import pino from 'pino';
import type { LogLevel } from './logger.type';

export interface Logger {
  set logLevel(level: LogLevel);
  trace(msgTemplate?: string, ...args: unknown[]): void;
  debug(msgTemplate?: string, ...args: unknown[]): void;
  info(msgTemplate?: string, ...args: unknown[]): void;
  warn(msgTemplate?: string, ...args: unknown[]): void;
  error(msgTemplate?: string, ...args: unknown[]): void;
  log(msgTemplate?: string, ...args: unknown[]): void;
  child(options: Record<string, unknown>): pino.Logger;
}
