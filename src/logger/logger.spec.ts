import { LoggerFactory } from './logger-factory';

describe('Logger', () => {
  it('Always get the same logger for the same name', () => {
    const logger1 = LoggerFactory.getLogger('pebbles:logger');
    const logger2 = LoggerFactory.getLogger('pebbles:logger');
    expect(logger1 === logger2).toBe(true);
  });
});
