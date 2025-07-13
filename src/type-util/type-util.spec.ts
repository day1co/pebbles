import { makeLiteralTypeList } from './type-util';
import type { PickWithPartial, RequiredPartialProps } from './type-util.type';

describe('makeLiteralTypeList', () => {
  it('should return array', () => {
    expect(makeLiteralTypeList('foo', 'bar', 'baz', 'qux', 'quux')).toEqual([
      'foo',
      'bar',
      'baz',
      'qux',
      'quux',
    ]);
    expect(makeLiteralTypeList(1, 3, 2, 4, 5)).toEqual([1, 3, 2, 4, 5]);
    expect(makeLiteralTypeList('foo', 1, 'bar', 2, undefined)).toEqual([
      'foo',
      1,
      'bar',
      2,
      undefined,
    ]);
  });
});

describe('PickWithPartial', () => {
  it('should return ok', () => {
    interface MockInterface {
      prop1: number;
      prop2: string;
      prop3: boolean;
    }
    const implementedObj1: PickWithPartial<MockInterface, 'prop1'> = { prop1: 1 };
    const implementedObj2: PickWithPartial<MockInterface, 'prop1' | 'prop2'> = {
      prop1: 2,
      prop2: 'string',
    };
    expect(implementedObj1).toHaveProperty('prop1');
    expect(implementedObj2).not.toHaveProperty('prop3');
  });
});

describe('RequiredPartialProps', () => {
  it('should return ok', () => {
    interface MockInterface {
      prop1: number;
      prop2?: string;
      prop3?: boolean;
    }
    const implementedObj1: RequiredPartialProps<MockInterface, 'prop2'> = {
      prop1: 1,
      prop2: 'hello',
    };
    const implementedObj2: RequiredPartialProps<MockInterface, 'prop2' | 'prop3'> = {
      prop1: 2,
      prop2: 'world',
      prop3: true,
    };
    expect(implementedObj1).toHaveProperty('prop2');
    expect(implementedObj2).toHaveProperty('prop3');
  });
});
