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

    let logger: Logger | undefined = this.instance.loggerMap.get(name);

    if (!logger) {
      logger = new PinoLogger(name);
      this.instance.loggerMap.set(name, logger);
    }

    return logger;
  }
}
