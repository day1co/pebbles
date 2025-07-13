import { byteUnitConverter } from './byte-unit-converter';

describe('byteUnitConverter', () => {
  const DataSizeUnitMap = {
    bytes: 'bytes',
    kilobytes: 'KB',
    megabytes: 'MB',
  };
  const getSizeNum = (size: string): number => {
    return Number(size.split(' ')[0]);
  };

  describe('convert', () => {
    it('throws Error with negative size', () => {
      const negativeValue1 = -1;
      const negativeValue2 = -0.001;

      expect(() =>
        byteUnitConverter.convert({
          value: negativeValue1,
          inputUnit: 'bytes',
          outputUnit: 'megabytes',
        })
      ).toThrow();

      expect(() =>
        byteUnitConverter.convert({
          value: negativeValue2,
          inputUnit: 'bytes',
          outputUnit: 'megabytes',
        })
      ).toThrow();
    });

    it('should return input size as is when the convertable size is out of provided unit.', () => {
      const value1 = 10000000000;
      const value2 = 0.000000001;

      const test1 = byteUnitConverter.convert({ value: value1, inputUnit: 'bytes' });
      const test2 = byteUnitConverter.convert({ value: value2, inputUnit: 'kilobytes' });

      expect(test1).toBe(`${value1} ${DataSizeUnitMap.bytes}`);
      expect(test2).toBe(`${value2.toString()} ${DataSizeUnitMap.kilobytes}`);
    });

    it('converts data size to a convertable unit that returns the minimum interger when outputUnit is not provided', () => {
      const value1 = 1000;
      const value2 = 0.000001;
      const value3 = 100000000;
      const value4 = 123456789;
      const value5 = 0.0129;

      const expected1 = 1;
      const expected2 = 1;
      const expected3 = 100;
      const expected4 = 123;
      const expected5 = 13;

      const test1 = byteUnitConverter.convert({ value: value1, inputUnit: 'kilobytes' });
      const test2 = byteUnitConverter.convert({ value: value2, inputUnit: 'megabytes' });
      const test3 = byteUnitConverter.convert({ value: value3, inputUnit: 'bytes' });
      const test4 = byteUnitConverter.convert({ value: value4, inputUnit: 'bytes' });
      const test5 = byteUnitConverter.convert({ value: value5, inputUnit: 'kilobytes' });

      expect(getSizeNum(test1)).toBe(expected1);
      expect(getSizeNum(test2)).toBe(expected2);
      expect(getSizeNum(test3)).toBe(expected3);
      expect(getSizeNum(test4)).toBe(expected4);
      expect(getSizeNum(test5)).toBe(expected5);
    });

    it('converts data size from inputUnit to outputUnit', () => {
      const value = 1000;

      const test1 = byteUnitConverter.convert({
        value,
        inputUnit: 'bytes',
        outputUnit: 'kilobytes',
      });
      const test2 = byteUnitConverter.convert({
        value,
        inputUnit: 'bytes',
        outputUnit: 'megabytes',
      });
      const test3 = byteUnitConverter.convert({
        value,
        inputUnit: 'megabytes',
        outputUnit: 'bytes',
      });
      const test4 = byteUnitConverter.convert({
        value,
        inputUnit: 'megabytes',
        outputUnit: 'kilobytes',
      });

      expect(getSizeNum(test1)).toBeLessThan(value);
      expect(getSizeNum(test2)).toBeLessThan(value);
      expect(getSizeNum(test3)).toBeGreaterThan(value);
      expect(getSizeNum(test4)).toBeGreaterThan(value);

      expect(getSizeNum(test1)).toBeGreaterThan(getSizeNum(test2));
      expect(getSizeNum(test3)).toBeGreaterThan(getSizeNum(test4));
    });
  });
});
