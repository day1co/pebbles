import { StringUtil } from './string-util';

describe('StringUtil', () => {
  describe('toBoolean', () => {
    it('should throw with incompatible input', () => {
      expect(() => {
        StringUtil.toBoolean('abc');
      }).toThrow();
      expect(() => {
        StringUtil.toBoolean('1111');
      }).toThrow();
      expect(() => {
        StringUtil.toBoolean('');
      }).toThrow();
      expect(() => {
        StringUtil.toBoolean('nay');
      }).toThrow();
    });
    it('should return parameter in boolean type', () => {
      expect(StringUtil.toBoolean(true)).toEqual(true);
      expect(StringUtil.toBoolean('true')).toEqual(true);
      expect(StringUtil.toBoolean(false)).toEqual(false);
      expect(StringUtil.toBoolean('false')).toEqual(false);
      expect(StringUtil.toBoolean('1')).toEqual(true);
      expect(StringUtil.toBoolean('0')).toEqual(false);
      expect(StringUtil.toBoolean('yes')).toEqual(true);
      expect(StringUtil.toBoolean('no')).toEqual(false);
      expect(StringUtil.toBoolean('Y')).toEqual(true);
      expect(StringUtil.toBoolean('N')).toEqual(false);
      expect(StringUtil.toBoolean('On')).toEqual(true);
      expect(StringUtil.toBoolean('Off')).toEqual(false);
      expect(StringUtil.toBoolean('TRUE')).toEqual(true);
      expect(StringUtil.toBoolean('FALSE')).toEqual(false);
    });
  });
  describe('splitTags', () => {
    it('should return array of tags', () => {
      const str = 'one, two , ,  three , four  ,five six ';
      expect(StringUtil.splitTags(str)).toEqual([
        { text: 'one' },
        { text: 'two' },
        { text: 'three' },
        { text: 'four' },
        { text: 'five six' },
      ]);
    });
    it('should return empty array when tags are invalid', () => {
      const str = ' , , ';
      expect(StringUtil.splitTags(str)).toEqual([]);
    });
    it('should return empty array when empty string is given', () => {
      expect(StringUtil.splitTags('')).toEqual([]);
    });
  });

  describe('split', () => {
    it('should return array of text', () => {
      const str = 'one, two , ,  three , four  ,five six ';
      expect(StringUtil.split(str)).toEqual(['one', 'two', 'three', 'four', 'five six']);
    });
    it('should return empty array when tags are invalid', () => {
      const str = ' , , ';
      expect(StringUtil.split(str)).toEqual([]);
    });
    it('should return empty array when empty string is given', () => {
      expect(StringUtil.split('')).toEqual([]);
    });
  });

  describe('joinTags', () => {
    it('should return string of tags', () => {
      const tags = [{ text: 'one ' }, { text: ' two' }, { text: ' three ' }, { text: 'four' }, { text: 'five six' }];
      expect(StringUtil.joinTags(tags)).toEqual('one,two,three,four,five six');
    });
    it('should return empty string when tags are invalid', () => {
      expect(StringUtil.joinTags([{ text: ' ' }, { text: '' }])).toEqual('');
    });
    it('should return empty string when empty string is given', () => {
      expect(StringUtil.joinTags([])).toEqual('');
    });
  });

  describe('join', () => {
    it('should return string when a list of text is given', () => {
      const textList = ['one ', ' two', ' three ', 'four', 'five six'];
      expect(StringUtil.join(textList)).toBe('one,two,three,four,five six');
    });
    it('should return empty string when only empty strings are given', () => {
      expect(StringUtil.join([' ', '  '])).toBe('');
    });
    it(`should return '' when empty array is given`, () => {
      expect(StringUtil.join([])).toBe('');
    });
  });

  describe('compactTextMessage', () => {
    it('should allow korean text at maximum 43', () => {
      const fullText =
        '사십오글자제한에맞나사십오글자제한에맞나사십오글자제한에맞나사십오글자제한에맞나가나다라마바사아자차카';
      const textToBeTrimmed = '가나다라마바사아자차카';
      const trimmedText = StringUtil.compactTextMessage(fullText, textToBeTrimmed);
      // 뒤에 '...'이 붙기 때문에 한글은 최대 43글자만 허용.
      expect(trimmedText.length - 3).toBeLessThanOrEqual(43);
    });

    it('should return compact korean text in default 90 bytes', () => {
      const fullText =
        '[안내 문자] 길이가 긴 안내 메세지입니다. 여기를 잘라주세요오. 길이가 길기 때문에 메세지를 잘라야 합니다.';
      const textToBeTrimmed = '여기를 잘라주세요오.';
      const trimmedText = StringUtil.compactTextMessage(fullText, textToBeTrimmed);
      expect(trimmedText).toBe(
        '[안내 문자] 길이가 긴 안내 메세지입니다. 여... 길이가 길기 때문에 메세지를 잘라야 합니다.'
      );
    });

    it('should return compact korean text in given custom bytes', () => {
      const fullText = '[안내 문자] 이건 50바이트짜리 문자입니다. 여기가 잘려야 합니다';
      const textToBeTrimmed = '여기가 잘려야 합니다';
      const trimmedText = StringUtil.compactTextMessage(fullText, textToBeTrimmed, 50);
      expect(trimmedText).toBe('[안내 문자] 이건 50바이트짜리 문자입니다. 여기...');
    });

    it('should return given text intact if it is short', () => {
      const fullText = '[안내 문자] 길이가 짧은 안내 메세지입니다.';
      const textToBeTrimmed = '길이가 짧은 안내 메세지입니다.';
      const trimmedText = StringUtil.compactTextMessage(fullText, textToBeTrimmed);
      expect(trimmedText).toBe(fullText);
    });
  });
});
