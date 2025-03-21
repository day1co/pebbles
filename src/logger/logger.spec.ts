import { LoggerFactory } from './logger-factory';
import { PinoLogger } from './logger-impl/pino-logger';
import pino from 'pino';

jest.mock('pino', () => {
  const mockPino = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  
  return jest.fn(() => mockPino);
});

describe('Logger', () => {
  let mockPinoInstance: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockPinoInstance = (pino as unknown as jest.Mock).mock.results[0]?.value || {};
  });
  
  it('should always get the same logger for the same name', () => {
    const logger1 = LoggerFactory.getLogger('pebbles:logger');
    const logger2 = LoggerFactory.getLogger('pebbles:logger');
    expect(logger1 === logger2).toBe(true);
  });
  
  it('should create different loggers for different names', () => {
    const logger1 = LoggerFactory.getLogger('pebbles:logger1');
    const logger2 = LoggerFactory.getLogger('pebbles:logger2');
    expect(logger1 === logger2).toBe(false);
  });
  
  describe('PinoLogger', () => {
    let logger: PinoLogger;
    
    beforeEach(() => {
      logger = new PinoLogger('test-logger');
      mockPinoInstance = (pino as unknown as jest.Mock).mock.results[0]?.value;
    });
    
    it('should create logger with correct name and default level', () => {
      expect(pino).toHaveBeenCalledWith({ name: 'test-logger', level: 'debug' });
    });
    
    it('should set log level correctly', () => {
      logger.logLevel = 'error';
      expect(mockPinoInstance.level).toBe('error');
      
      logger.logLevel = 'warn';
      expect(mockPinoInstance.level).toBe('warn');
      
      logger.logLevel = 'info';
      expect(mockPinoInstance.level).toBe('info');
      
      logger.logLevel = 'debug';
      expect(mockPinoInstance.level).toBe('debug');
      
      logger.logLevel = 'trace';
      expect(mockPinoInstance.level).toBe('trace');
    });
    
    it('should call the trace method correctly', () => {
      logger.trace('trace message');
      expect(mockPinoInstance.trace).toHaveBeenCalledWith('trace message');
      
      logger.trace('trace message with %s', 'parameter');
      expect(mockPinoInstance.trace).toHaveBeenCalledWith('trace message with %s', 'parameter');
      
      logger.trace('trace message with multiple %s %d', 'params', 123);
      expect(mockPinoInstance.trace).toHaveBeenCalledWith('trace message with multiple %s %d', 'params', 123);
      
      logger.trace();
      expect(mockPinoInstance.trace).toHaveBeenCalledWith('');
    });
    
    it('should call the debug method correctly', () => {
      logger.debug('debug message');
      expect(mockPinoInstance.debug).toHaveBeenCalledWith('debug message');
      
      logger.debug('debug message with %s', 'parameter');
      expect(mockPinoInstance.debug).toHaveBeenCalledWith('debug message with %s', 'parameter');
      
      logger.debug();
      expect(mockPinoInstance.debug).toHaveBeenCalledWith('');
    });
    
    it('should call the info method correctly', () => {
      logger.info('info message');
      expect(mockPinoInstance.info).toHaveBeenCalledWith('info message');
      
      logger.info('info message with %s', 'parameter');
      expect(mockPinoInstance.info).toHaveBeenCalledWith('info message with %s', 'parameter');
      
      logger.info();
      expect(mockPinoInstance.info).toHaveBeenCalledWith('');
    });
    
    it('should call the warn method correctly', () => {
      logger.warn('warn message');
      expect(mockPinoInstance.warn).toHaveBeenCalledWith('warn message');
      
      logger.warn('warn message with %s', 'parameter');
      expect(mockPinoInstance.warn).toHaveBeenCalledWith('warn message with %s', 'parameter');
      
      logger.warn();
      expect(mockPinoInstance.warn).toHaveBeenCalledWith('');
    });
    
    it('should call the error method correctly', () => {
      logger.error('error message');
      expect(mockPinoInstance.error).toHaveBeenCalledWith('error message');
      
      logger.error('error message with %s', 'parameter');
      expect(mockPinoInstance.error).toHaveBeenCalledWith('error message with %s', 'parameter');
      
      logger.error();
      expect(mockPinoInstance.error).toHaveBeenCalledWith('');
    });
    
    it('should verify that log is an alias for debug', () => {
      logger.log('log message');
      expect(mockPinoInstance.debug).toHaveBeenCalledWith('log message');
      
      logger.log('log message with %s', 'parameter');
      expect(mockPinoInstance.debug).toHaveBeenCalledWith('log message with %s', 'parameter');
    });
    
    it('should handle complex objects as parameters', () => {
      const obj = { key: 'value', nested: { key2: 'value2' } };
      logger.info('info with object: %o', obj);
      expect(mockPinoInstance.info).toHaveBeenCalledWith('info with object: %o', obj);
      
      const err = new Error('test error');
      logger.error('error with error object', err);
      expect(mockPinoInstance.error).toHaveBeenCalledWith('error with error object', err);
    });
  });
});
