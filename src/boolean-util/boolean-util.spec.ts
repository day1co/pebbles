import { BooleanUtil } from './boolean-util';

describe('BooleanUtil', () => {
  describe('valueOf', () => {
    it('should throw with incompatible input', () => {
      expect(() => BooleanUtil.valueOf('abc')).toThrow();
      expect(() => BooleanUtil.valueOf('1111')).toThrow();
      expect(() => BooleanUtil.valueOf('')).toThrow();
      expect(() => BooleanUtil.valueOf('nay')).toThrow();
    });
    it('should return parameter in boolean type', () => {
      expect(BooleanUtil.valueOf('true')).toEqual(true);
      expect(BooleanUtil.valueOf('false')).toEqual(false);
      expect(BooleanUtil.valueOf('1')).toEqual(true);
      expect(BooleanUtil.valueOf('0')).toEqual(false);
      expect(BooleanUtil.valueOf('yes')).toEqual(true);
      expect(BooleanUtil.valueOf('no')).toEqual(false);
      expect(BooleanUtil.valueOf('Y')).toEqual(true);
      expect(BooleanUtil.valueOf('N')).toEqual(false);
      expect(BooleanUtil.valueOf('On')).toEqual(true);
      expect(BooleanUtil.valueOf('Off')).toEqual(false);
      expect(BooleanUtil.valueOf('TRUE')).toEqual(true);
      expect(BooleanUtil.valueOf('FALSE')).toEqual(false);
    });

    it('should handle mixed case input correctly', () => {
      expect(BooleanUtil.valueOf('True')).toEqual(true);
      expect(BooleanUtil.valueOf('fAlSe')).toEqual(false);
      expect(BooleanUtil.valueOf('YeS')).toEqual(true);
      expect(BooleanUtil.valueOf('nO')).toEqual(false);
      expect(BooleanUtil.valueOf('oN')).toEqual(true);
      expect(BooleanUtil.valueOf('oFf')).toEqual(false);
    });

    it('should handle whitespace correctly', () => {
      expect(() => BooleanUtil.valueOf(' true')).toThrow();
      expect(() => BooleanUtil.valueOf('false ')).toThrow();
      expect(() => BooleanUtil.valueOf(' yes ')).toThrow();
      expect(() => BooleanUtil.valueOf('\tno')).toThrow();
      expect(() => BooleanUtil.valueOf('1\n')).toThrow();
    });

    it('should handle partial matches correctly', () => {
      expect(() => BooleanUtil.valueOf('truex')).toThrow();
      expect(() => BooleanUtil.valueOf('xtrue')).toThrow();
      expect(() => BooleanUtil.valueOf('falsify')).toThrow();
      expect(() => BooleanUtil.valueOf('notan')).toThrow();
      expect(() => BooleanUtil.valueOf('yessir')).toThrow();
    });

    it('should handle invalid input types with appropriate error messages', () => {
      const errorPattern = /unable to convert .* to boolean type/;
      
      // Using assertions on error messages with proper error typing
      try {
        BooleanUtil.valueOf('invalid');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toMatch(errorPattern);
        expect(error.message).toContain('invalid');
      }
      
      try {
        BooleanUtil.valueOf('maybe');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toMatch(errorPattern);
        expect(error.message).toContain('maybe');
      }
    });
  });
});
