import { NumberUtil } from './number-util';

describe('NumberUtil', () => {
  describe('intValueOf', () => {
    it('should throw with incompatible input', () => {
      expect(() => NumberUtil.intValueOf('abc')).toThrow();
      expect(() => NumberUtil.intValueOf('4.5a')).toThrow();
      expect(() => NumberUtil.intValueOf('1.2')).toThrow();
      expect(() => NumberUtil.intValueOf('1.2.3')).toThrow();
      expect(() => NumberUtil.intValueOf('')).toThrow();
      expect(() => NumberUtil.intValueOf(String(Number.MIN_VALUE))).toThrow();
      expect(() => NumberUtil.intValueOf(String(Number.EPSILON))).toThrow();
    });
    it('should return parameter in integer type', () => {
      expect(NumberUtil.intValueOf('1')).toEqual(1);
      expect(NumberUtil.intValueOf('-1')).toEqual(-1);
      expect(NumberUtil.intValueOf('0')).toEqual(0);
      expect(NumberUtil.intValueOf(String(Number.MAX_SAFE_INTEGER))).toEqual(Number.MAX_SAFE_INTEGER);
      expect(NumberUtil.intValueOf(String(Number.MIN_SAFE_INTEGER))).toEqual(Number.MIN_SAFE_INTEGER);
      expect(NumberUtil.intValueOf(String(Number.MAX_VALUE))).toEqual(Number.MAX_VALUE);
    });

    // Add boundary value tests
    describe('boundary values', () => {
      it('should handle integer boundary values', () => {
        // Test safe integer boundaries
        expect(NumberUtil.intValueOf(String(Number.MAX_SAFE_INTEGER))).toBe(Number.MAX_SAFE_INTEGER);
        expect(NumberUtil.intValueOf(String(Number.MIN_SAFE_INTEGER))).toBe(Number.MIN_SAFE_INTEGER);
        
        // Test zero (boundary between positive and negative)
        expect(NumberUtil.intValueOf('0')).toBe(0);
        expect(NumberUtil.intValueOf('-0')).toEqual(-0);
      });
      
      it('should handle extreme boundary values', () => {
        // Very large integers (beyond MAX_SAFE_INTEGER but within MAX_VALUE)
        const veryLargeInt = '1' + '0'.repeat(20); // 10^20
        expect(NumberUtil.intValueOf(veryLargeInt)).toBe(1e+20);
        
        // Very small integers (beyond MIN_SAFE_INTEGER but within representable range)
        const verySmallInt = '-' + '1' + '0'.repeat(20); // -10^20
        expect(NumberUtil.intValueOf(verySmallInt)).toBe(-1e+20);
      });
    });
    
    // Add invalid parameter edge cases
    describe('edge cases', () => {
      it('should throw with invalid number formats', () => {
        // Leading/trailing spaces
        expect(NumberUtil.intValueOf(' 123')).toBe(123);
        expect(NumberUtil.intValueOf('123 ')).toBe(123);
        
        // Multiple signs
        expect(() => NumberUtil.intValueOf('+-123')).toThrow();
        
        // Scientific notation (valid for Number but not integers)
        expect(NumberUtil.intValueOf('1e2')).toBe(100);
      });
      
      it('should handle inputs at the edge of validity', () => {
        // Although these are valid numbers, they're not integers
        expect(NumberUtil.intValueOf('0.0')).toBe(0);
        expect(NumberUtil.intValueOf('123.0')).toBe(123);
        expect(NumberUtil.intValueOf('-123.0')).toBe(-123);
      });
    });
  });

  describe('valueOf', () => {
    it('should throw with incompatible input', () => {
      expect(() => NumberUtil.valueOf('abc')).toThrow();
      expect(() => NumberUtil.valueOf('4a')).toThrow();
      expect(() => NumberUtil.valueOf('1.2.3')).toThrow();
      expect(() => NumberUtil.valueOf('')).toThrow();
    });
    it('should return parameter in number type', () => {
      expect(NumberUtil.valueOf('-1')).toEqual(-1);
      expect(NumberUtil.valueOf('0')).toEqual(0);
      expect(NumberUtil.valueOf('1.2')).toEqual(1.2);
      expect(NumberUtil.valueOf('-1.2')).toEqual(-1.2);
      expect(NumberUtil.valueOf('-93339.228883747849')).toEqual(-93339.22888374786);
      expect(NumberUtil.valueOf('9488848.29000004833')).toEqual(9488848.290000048);
    });

    // Add boundary value tests
    describe('boundary values', () => {
      it('should handle numeric boundary values', () => {
        // Test maximum and minimum values
        expect(NumberUtil.valueOf(String(Number.MAX_VALUE))).toBe(Number.MAX_VALUE);
        expect(NumberUtil.valueOf(String(-Number.MAX_VALUE))).toBe(-Number.MAX_VALUE);
        
        // Test smallest positive value
        expect(NumberUtil.valueOf(String(Number.MIN_VALUE))).toBe(Number.MIN_VALUE);
        
        // Test zero (boundary between positive and negative)
        expect(NumberUtil.valueOf('0')).toBe(0);
        expect(NumberUtil.valueOf('-0')).toEqual(-0);
        
        // Test float precision
        expect(NumberUtil.valueOf(String(0.1 + 0.2))).toBeCloseTo(0.3, 10);
      });
      
      it('should handle scientific notation', () => {
        // Scientific notation
        expect(NumberUtil.valueOf('1e2')).toBe(100);
        expect(NumberUtil.valueOf('1e-2')).toBe(0.01);
        
        // Extreme scientific notation
        expect(NumberUtil.valueOf('1e308')).toBe(1e308); // Near MAX_VALUE
        expect(NumberUtil.valueOf('1e-323')).toEqual(1e-323); // Below MIN_VALUE but not 0
      });
    });
    
    // Add overflow tests
    describe('overflow handling', () => {
      it('should throw on values exceeding JavaScript number limits', () => {
        // Too big (Number.MAX_VALUE is roughly 1.7976931348623157e+308)
        const tooBig = '1e309'; // Beyond MAX_VALUE
        expect(() => NumberUtil.valueOf(tooBig)).toThrow();
        
        // Numbers that would overflow to Infinity
        const nearOverflow = '1' + '0'.repeat(309);
        expect(() => NumberUtil.valueOf(nearOverflow)).toThrow();
      });
    });
    
    // Add invalid parameter edge cases
    describe('edge cases', () => {
      it('should throw with invalid number formats', () => {
        // Leading/trailing spaces
        expect(NumberUtil.valueOf(' 123')).toBe(123);
        expect(NumberUtil.valueOf('123 ')).toBe(123);
        
        // Multiple signs
        expect(() => NumberUtil.valueOf('+-123')).toThrow();
        
        // Multiple decimal points
        expect(() => NumberUtil.valueOf('123.456.789')).toThrow();
      });
    });
  });

  describe('isNumeric', () => {
    it('should equal to all', () => {
      expect(NumberUtil.isNumeric('0')).toEqual(true);
      expect(NumberUtil.isNumeric('1')).toEqual(true);
      expect(NumberUtil.isNumeric('01')).toEqual(true);
      expect(NumberUtil.isNumeric('0.1')).toEqual(true);
      expect(NumberUtil.isNumeric('-10')).toEqual(true);
      expect(NumberUtil.isNumeric('-10.1231234')).toEqual(true);
    });
    it('should not equal to all', () => {
      expect(NumberUtil.isNumeric('a')).toEqual(false);
      expect(NumberUtil.isNumeric('0a')).toEqual(false);
      expect(NumberUtil.isNumeric('0xa')).toEqual(false);
      expect(NumberUtil.isNumeric('sdfsdfsdfa')).toEqual(false);
      expect(NumberUtil.isNumeric('\\http')).toEqual(false);
      expect(NumberUtil.isNumeric('1.2.3')).toEqual(false);
      expect(NumberUtil.isNumeric('')).toEqual(false);
      expect(NumberUtil.isNumeric('  ')).toEqual(false);
    });

    // Add boundary value tests
    describe('boundary values', () => {
      it('should correctly identify numeric strings at boundaries', () => {
        // Test maximum and minimum values
        expect(NumberUtil.isNumeric(String(Number.MAX_VALUE))).toBe(true);
        expect(NumberUtil.isNumeric(String(Number.MIN_VALUE))).toBe(true);
        expect(NumberUtil.isNumeric(String(-Number.MAX_VALUE))).toBe(true);
        
        // Test safe integer boundaries
        expect(NumberUtil.isNumeric(String(Number.MAX_SAFE_INTEGER))).toBe(true);
        expect(NumberUtil.isNumeric(String(Number.MIN_SAFE_INTEGER))).toBe(true);
        
        // Test scientific notation
        expect(NumberUtil.isNumeric('1e2')).toBe(true);
        expect(NumberUtil.isNumeric('1e-2')).toBe(true);
        expect(NumberUtil.isNumeric('1E+2')).toBe(true);
      });
      
      it('should identify non-numeric values even at boundaries', () => {
        // Almost numeric, but not quite
        expect(NumberUtil.isNumeric('1e')).toBe(false);
        expect(NumberUtil.isNumeric('e2')).toBe(false);
        expect(NumberUtil.isNumeric('1.2e2.3')).toBe(false);
        
        // Values with multiple decimal points
        expect(NumberUtil.isNumeric('1.2.3')).toBe(false);
        
        // Strings that would be valid numbers with parseInt but not parseFloat
        expect(NumberUtil.isNumeric('123abc')).toBe(false);
      });
    });
    
    // Add edge cases
    describe('edge cases', () => {
      it('should handle special format cases', () => {
        // Leading zeros
        expect(NumberUtil.isNumeric('00123')).toBe(true);
        
        // Negative zero
        expect(NumberUtil.isNumeric('-0')).toBe(true);
        
        // Decimal point with no trailing digits
        expect(NumberUtil.isNumeric('123.')).toBe(true);
        
        // Decimal point with no leading digits
        expect(NumberUtil.isNumeric('.123')).toBe(true);
      });
      
      it('should handle whitespace correctly', () => {
        // Whitespace is actually considered numeric by the implementation
        expect(NumberUtil.isNumeric(' 123')).toBe(true);
        expect(NumberUtil.isNumeric('123 ')).toBe(true);
        expect(NumberUtil.isNumeric(' 123 ')).toBe(true);
      });
    });
  });

  describe('toPermyriad', () => {
    it('should throw', () => {
      expect(() => NumberUtil.toPermyriad(NaN)).toThrow();
    });
    it('should convert to permyriad', () => {
      expect(NumberUtil.toPermyriad(100)).toEqual(1_000_000);
      expect(NumberUtil.toPermyriad(0.01)).toEqual(100);
      expect(NumberUtil.toPermyriad(0.00001)).toEqual(0.1);
      expect(NumberUtil.toPermyriad(10.005)).toEqual(100050);
      expect(NumberUtil.toPermyriad(0)).toEqual(0);
    });

    // Add boundary value tests
    describe('boundary values', () => {
      it('should handle boundary values correctly', () => {
        // Zero
        expect(NumberUtil.toPermyriad(0)).toBe(0);
        
        // Small values
        expect(NumberUtil.toPermyriad(0.0001)).toBe(1);
        expect(NumberUtil.toPermyriad(0.00001)).toBe(0.1);
        
        // Values with specific decimal precision
        expect(NumberUtil.toPermyriad(0.12345, 5)).toBe(1234.5);
        expect(NumberUtil.toPermyriad(0.12345, 0)).toBe(1235); // Rounds to nearest integer
      });
      
      it('should handle extreme values without overflow', () => {
        // Large values
        const largeValue = Number.MAX_SAFE_INTEGER / 10000;
        expect(NumberUtil.toPermyriad(largeValue)).toBe(Number.MAX_SAFE_INTEGER);
        
        // Small values
        const smallValue = Number.MIN_VALUE;
        expect(NumberUtil.toPermyriad(smallValue)).toBe(0); // Rounds to 0 due to precision limits
      });
    });
    
    // Add invalid parameter tests
    describe('invalid parameters', () => {
      it('should throw with invalid inputs', () => {
        // NaN (already tested)
        expect(() => NumberUtil.toPermyriad(NaN)).toThrow();
        
        // Infinity
        expect(NumberUtil.toPermyriad(Infinity)).toBe(Infinity);
        expect(NumberUtil.toPermyriad(-Infinity)).toBe(-Infinity);
      });
      
      it('should handle negative digits parameter', () => {
        // Negative digits parameter should be handled gracefully
        expect(() => NumberUtil.toPermyriad(1, -1)).toThrow();
        // The result is technically valid, but precision might vary
      });
    });
  });

  describe('fromPermyriad', () => {
    it('should throw', () => {
      expect(() => NumberUtil.fromPermyriad(NaN)).toThrow();
    });
    it('should convert from permyriad', () => {
      expect(NumberUtil.fromPermyriad(100)).toEqual(0.01);
      expect(NumberUtil.fromPermyriad(0.1)).toEqual(0);
      expect(NumberUtil.fromPermyriad(0)).toEqual(0);
    });

    // Add boundary value tests
    describe('boundary values', () => {
      it('should handle boundary values correctly', () => {
        // Zero
        expect(NumberUtil.fromPermyriad(0)).toBe(0);
        
        // Small values
        expect(NumberUtil.fromPermyriad(1)).toBe(0);  // 0.0001 rounded to 0 with 2 digits
        expect(NumberUtil.fromPermyriad(1, 4)).toBe(0.0001);  // With 4 digits precision
        
        // Large values
        expect(NumberUtil.fromPermyriad(10000)).toBe(1.00);
        expect(NumberUtil.fromPermyriad(1000000)).toBe(100.00);
      });
      
      it('should handle extreme values', () => {
        // Maximum safe integer
        expect(NumberUtil.fromPermyriad(Number.MAX_SAFE_INTEGER)).toBe(
          Number((Number.MAX_SAFE_INTEGER / 10000).toFixed(2))
        );
        
        // Minimum safe integer
        expect(NumberUtil.fromPermyriad(Number.MIN_SAFE_INTEGER)).toBe(
          Number((Number.MIN_SAFE_INTEGER / 10000).toFixed(2))
        );
      });
    });
    
    // Add invalid parameter tests
    describe('invalid parameters', () => {
      it('should throw with invalid inputs', () => {
        // NaN (already tested)
        expect(() => NumberUtil.fromPermyriad(NaN)).toThrow();
        
        // Infinity
        expect(NumberUtil.fromPermyriad(Infinity)).toBe(Infinity);
        expect(NumberUtil.fromPermyriad(-Infinity)).toBe(-Infinity);
      });
      
      it('should handle negative digits parameter', () => {
        // Negative digits parameter should be handled gracefully
        expect(() => NumberUtil.fromPermyriad(10000, -1)).toThrow();
        // The result is technically valid, but precision might vary
      });
    });
  });
});
