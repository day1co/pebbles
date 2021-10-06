import type { ILogger } from './logger.interface';
import { Logger } from './logger';

export class LoggerFactory {
  private readonly loggerMap: Map<string, ILogger>;
  private static instance: LoggerFactory;

  private constructor() {
    this.loggerMap = new Map();
  }

  static getLogger(name: string): ILogger {
    if (!this.instance) {
      this.instance = new LoggerFactory();
    }

    let result: ILogger | undefined = this.instance.loggerMap.get(name);

    if (!result) {
      result = new Logger(name);
      this.instance.loggerMap.set(name, result);
    }

    return result;
  }
}
