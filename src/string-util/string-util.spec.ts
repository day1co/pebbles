import { StringUtil } from './string-util';

describe('StringUtil', () => {
  describe('renderTemplate', () => {
    it('should render a template with double brackets', () => {
      const testTemplate1 = 'Hello {{name}}!';
      const testTemplate2 = '[{{site}}] 가입을 환영합니다 {{name}}님!';

      expect(StringUtil.renderTemplate(testTemplate1, { name: 'World' })).toEqual('Hello World!');
      expect(StringUtil.renderTemplate(testTemplate1, { name: 'World', foo: 'bar' })).toEqual('Hello World!');
      expect(StringUtil.renderTemplate(testTemplate2, { site: '콜로소', name: '아무개' })).toEqual(
        '[콜로소] 가입을 환영합니다 아무개님!'
      );
    });

    it('should render a template with triple brackets as HTML tag', () => {
      const testTemplate = '{{{test}}} 👈🏻 이건 HTML tag고, {{test}} 👈🏻 이건 이스케이프된 문자입니다';
      expect(StringUtil.renderTemplate(testTemplate, { test: '<h1>Hello</h1>' })).toEqual(
        '<h1>Hello</h1> 👈🏻 이건 HTML tag고, &lt;h1&gt;Hello&lt;/h1&gt; 👈🏻 이건 이스케이프된 문자입니다'
      );
    });

    it('should render a template section', () => {
      const testTemplate1 = '{{#courses}}<b>{{title}}</b>{{/courses}}';
      const view1 = {
        courses: [{ title: '엑셀' }, { title: '자바' }, { title: '도커' }],
      };

      const testTemplate2 = '{{#nameList}}{{name}} {{/nameList}}';
      const view2 = {
        nameList: [{ name: 'FOO' }, { name: 'BAR' }, { name: 'BAZ' }],
      };

      expect(StringUtil.renderTemplate(testTemplate1, view1)).toEqual('<b>엑셀</b><b>자바</b><b>도커</b>');
      expect(StringUtil.renderTemplate(testTemplate2, view2)).toEqual('FOO BAR BAZ ');
    });

    it('should render a template with partial', () => {
      const template = '[문자테스트] 안내문자입니다 {{> partial}}';
      const partial = { partial: '문의사항은 아래링크로' };
      expect(StringUtil.renderTemplate(template, {}, partial)).toEqual(
        '[문자테스트] 안내문자입니다 문의사항은 아래링크로'
      );
    });
  });

  describe('normalizePhoneNumber', () => {
    it('should normalize phone number starting with 010 or 070', () => {
      expect(StringUtil.normalizePhoneNumber('01012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('010-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('010 1234 5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('07012345678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('070-1234-5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('070.1234.5678')).toBe('07012345678');
    });

    it('should normalize phone number starting with +82 or +082', () => {
      // 010
      expect(StringUtil.normalizePhoneNumber('+0821012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+08201012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+082-10-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+082-010-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+082--10 1234 5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+082 010 1234 5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+8201012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+821012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+82-010-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+82-10-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('+82 10 1234 5678')).toBe('01012345678');

      // 070
      expect(StringUtil.normalizePhoneNumber('+0827012345678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+08207012345678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+082 070 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+082-070-1234-5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+082 70 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+082-70-1234-5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+82 070 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+82-070-1234-5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+827012345678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+8207012345678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+82 70 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('+82-70-1234-5678')).toBe('07012345678');
    });

    it('should normalize phone number starting with 82 or 082', () => {
      // 010
      expect(StringUtil.normalizePhoneNumber('08201012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('0821012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('082 10 1234 5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('082 010 1234 5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('082-10-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('082-010-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('821012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('8201012345678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('82-10-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('82-010-1234-5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('82 10 1234 5678')).toBe('01012345678');
      expect(StringUtil.normalizePhoneNumber('82 010 1234 5678')).toBe('01012345678');

      // 070
      expect(StringUtil.normalizePhoneNumber('082 70 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('082-70-1234-5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('082 070 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('082-070-1234-5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('082 70 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('082-70-1234-5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('82 070 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('82-070-1234-5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('827012345678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('8207012345678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('82 70 1234 5678')).toBe('07012345678');
      expect(StringUtil.normalizePhoneNumber('82-70-1234-5678')).toBe('07012345678');
    });

    it('should normalize phone number even if it does not belong to domestic number type', () => {
      expect(StringUtil.normalizePhoneNumber('+1-123-456-8900')).toBe('11234568900');
      expect(StringUtil.normalizePhoneNumber('88123456789')).toBe('88123456789');
      expect(StringUtil.normalizePhoneNumber('83-1234-5678')).toBe('8312345678');
      expect(StringUtil.normalizePhoneNumber('+49 1234 56789')).toBe('49123456789');
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate phone number', () => {
      expect(StringUtil.isValidPhoneNumber('01012345678')).toBe(true);
      expect(StringUtil.isValidPhoneNumber('07012345678')).toBe(true);
      expect(StringUtil.isValidPhoneNumber('1012345678')).toBe(false);
      expect(StringUtil.isValidPhoneNumber('04412345678')).toBe(false);
      expect(StringUtil.isValidPhoneNumber('010123456789')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should return fail for invalid email address', () => {
      const falseEmail_1 = '';
      const falseEmail_2 = 'test@test';
      const falseEmail_3 = '@test.com';
      const falseEmail_4 = 'test@test,com';
      const falseEmail_5 = 'test@test@test';
      const falseEmail_6 = '.!#$%&@123123123123.com';
      const falseEmail_7 = 'test@,!#$%&.com';
      const falseEmail_8 = '<>@test.com';
      const falseEmail_9 = 'test @test.com';
      const falseEmail_10 = 'test@test.c';

      expect(StringUtil.isValidEmail(falseEmail_1)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_2)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_3)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_4)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_5)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_6)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_7)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_8)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_9)).toBe(false);
      expect(StringUtil.isValidEmail(falseEmail_10)).toBe(false);
    });

    it('should return true for valid email address', () => {
      const trueEmail_1 = 'test@test.com';
      const trueEmail_2 = 'TEST@TEST.com';
      const trueEmail_3 = 'test.test@test.com';
      const trueEmail_4 = 'test_##_!@test123.com';
      const trueEmail_5 = 'test@123123123.com';
      const trueEmail_6 = '9393933@131313.com';
      const trueEmail_7 = '?!☺️/test/☺️!?@test.com';

      expect(StringUtil.isValidEmail(trueEmail_1)).toBe(true);
      expect(StringUtil.isValidEmail(trueEmail_2)).toBe(true);
      expect(StringUtil.isValidEmail(trueEmail_3)).toBe(true);
      expect(StringUtil.isValidEmail(trueEmail_4)).toBe(true);
      expect(StringUtil.isValidEmail(trueEmail_5)).toBe(true);
      expect(StringUtil.isValidEmail(trueEmail_6)).toBe(true);
      expect(StringUtil.isValidEmail(trueEmail_7)).toBe(true);
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
