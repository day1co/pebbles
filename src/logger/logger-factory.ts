import type { Logger } from './logger.interface';
import { PinoLogger } from './pino-logger';

export class LoggerFactory {
  private readonly loggerMap: Map<string, Logger>;
  private static instance: LoggerFactory;

  private constructor() {
    this.loggerMap = new Map();
  }

  static getLogger(name: string): Logger {
    if (!this.instance) {
      this.instance = new LoggerFactory();
    }

    let result: Logger | undefined = this.instance.loggerMap.get(name);

    if (!result) {
      result = new PinoLogger(name);
      this.instance.loggerMap.set(name, result);
    }

    return result;
  }
}
