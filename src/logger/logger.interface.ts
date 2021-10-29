import { LogLevel } from './logger.type';

export interface Logger {
  set logLevel(level: LogLevel);
  debug(msgTemplate: string, ...args: unknown[]): void;
  info(msgTemplate: string, ...args: unknown[]): void;
  warn(msgTemplate: string, ...args: unknown[]): void;
  error(msgTemplate: string, ...args: unknown[]): void;
}
