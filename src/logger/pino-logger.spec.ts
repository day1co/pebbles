import { PinoLogger } from './pino-logger';

describe('PinoLogger', () => {
  describe('debug', () => {
    it('should pass when called as instance method', () => {
      const name = 'test';
      const pinoLogger = new PinoLogger(name);
      pinoLogger.debug('logging');
    });

    it('should pass when called as global context', () => {
      const name = 'test';
      const { debug } = new PinoLogger(name);
      debug('logging');
    });
  });
});
