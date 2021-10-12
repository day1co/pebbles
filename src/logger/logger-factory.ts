import type { AbstractLogger } from './logger.interface';
import { Logger } from './logger';

export class LoggerFactory {
  private readonly loggerMap: Map<string, AbstractLogger>;
  private static instance: LoggerFactory;

  private constructor() {
    this.loggerMap = new Map();
  }

  static getLogger(name: string): AbstractLogger {
    if (!this.instance) {
      this.instance = new LoggerFactory();
    }

    let result: AbstractLogger | undefined = this.instance.loggerMap.get(name);

    if (!result) {
      result = new Logger(name);
      this.instance.loggerMap.set(name, result);
    }

    return result;
  }
}
