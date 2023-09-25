import pino from 'pino';
import type { Logger } from '../logger.interface';
import type { LogLevel } from '../logger.type';

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger;

  constructor(name: string, transportOption?: { apiKey: string; site: string }) {
    const pinoConfig = { name, level: 'debug' };
    const apiKeyAuth = transportOption?.apiKey ?? (process.env.DD_API_KEY as any);
    this.logger = apiKeyAuth
      ? pino(
          pinoConfig,
          pino.transport({
            target: 'pino-datadog-transport',
            options: {
              ddClientConf: {
                authMethods: {
                  apiKeyAuth,
                },
              },
              ddServerConf: {
                site: transportOption?.site ?? 'datadoghq.eu',
              },
              service: name,
            },
          })
        )
      : pino(pinoConfig);
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

  log = this.debug;
}
