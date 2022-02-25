import { StringUtil } from './string-util';
import { TemplateOpts } from './string-util.interface';

describe('StringUtil', () => {
  describe('midMask', () => {
    it('should mask phone number', () => {
      const phone1 = '010-0000-0000';
      expect(StringUtil.midMask(phone1, 4, 4)).toBe('010-****-0000');
      expect(StringUtil.midMask(phone1, 9, 4)).toBe('010-0000-****');
      expect(StringUtil.midMask(phone1, 9, 4, 'X')).toBe('010-0000-XXXX');
    });

    it('should mask person name', () => {
      const name1 = '홍길동';
      const name2 = 'John Doe';
      expect(StringUtil.midMask(name1, 1, 1)).toBe('홍*동');
      expect(StringUtil.midMask(name2, 5, 3)).toBe('John ***');
    });

    it('should mask email', () => {
      const email1 = 'test@test.com';
      const email2 = 'abcdefg@test.com';
      const maskingLength = (email: string) => email.indexOf('@') - 2;
      expect(StringUtil.midMask(email1, 2, maskingLength(email1))).toBe('te**@test.com');
      expect(StringUtil.midMask(email2, 2, maskingLength(email2))).toBe('ab*****@test.com');
    });
  });

  describe('getNonce', () => {
    it('should return a random string', () => {
      const nonce1 = StringUtil.getNonce(8, 16);
      const nonce2 = StringUtil.getNonce(8, 16);
      const nonce3 = StringUtil.getNonce(8, 16);
      const nonce4 = StringUtil.getNonce(10, 36);
      const nonce5 = StringUtil.getNonce(10, 36);
      const nonce6 = StringUtil.getNonce(10, 36);

      expect(nonce1).toHaveLength(8);
      expect(nonce2).toHaveLength(8);
      expect(nonce3).toHaveLength(8);
      expect(nonce4).toHaveLength(10);
      expect(nonce5).toHaveLength(10);
      expect(nonce6).toHaveLength(10);

      expect(nonce1).not.toEqual(nonce2);
      expect(nonce1).not.toEqual(nonce3);
      expect(nonce2).not.toEqual(nonce3);
      expect(nonce4).not.toEqual(nonce5);
      expect(nonce4).not.toEqual(nonce6);
      expect(nonce5).not.toEqual(nonce6);
    });
  });

  describe('renderTemplate', () => {
    it('should render a template with double brackets', () => {
      const testOpt1 = { template: 'Hello {{name}}!', view: { name: 'World' } };
      const testOpt2 = {
        template: '[{{site}}] 가입을 환영합니다 {{name}}님!',
        view: { site: '콜로소', name: '아무개' },
      };
      expect(StringUtil.renderTemplate(testOpt1)).toEqual('Hello World!');
      expect(StringUtil.renderTemplate(testOpt2)).toEqual('[콜로소] 가입을 환영합니다 아무개님!');
    });

    it('should render a template with triple brackets as HTML tag', () => {
      const testOpt = {
        template: '<div>{{{hello}}}</div>',
        view: { hello: '<h1>Hello</h1>' },
      };
      expect(StringUtil.renderTemplate(testOpt)).toEqual('<div><h1>Hello</h1></div>');
    });

    it('should render a template section', () => {
      const testOpt1 = {
        template: '{{#courses}}<b>{{title}}</b>{{/courses}}',
        view: {
          courses: [{ title: '엑셀' }, { title: '자바' }, { title: '도커' }],
        },
      };
      const testOpt2 = {
        template: '{{#nameList}}{{name}} {{/nameList}}',
        view: {
          nameList: [{ name: 'FOO' }, { name: 'BAR' }, { name: 'BAZ' }],
        },
      };
      expect(StringUtil.renderTemplate(testOpt1)).toEqual('<b>엑셀</b><b>자바</b><b>도커</b>');
      expect(StringUtil.renderTemplate(testOpt2)).toEqual('FOO BAR BAZ ');
    });

    it('should render a template with partial', () => {
      const testOpt = {
        template: '[문자테스트] 안내문자입니다 {{> partial}}',
        view: {},
        partial: { partial: '문의사항은 아래링크로' },
      };
      expect(StringUtil.renderTemplate(testOpt)).toEqual('[문자테스트] 안내문자입니다 문의사항은 아래링크로');
    });

    it('should render a template with custom tags', () => {
      const testOpt: TemplateOpts = {
        template: '%{hello}, {{name}}',
        view: { hello: '안녕하세요' },
        customTag: ['%{', '}'],
      };
      expect(StringUtil.renderTemplate(testOpt)).toEqual('안녕하세요, {{name}}');
    });

    it('should throw with unclosed tag', () => {
      const testOpt = {
        template: '{{hello}',
        view: { hello: '안녕하세요' },
      };
      expect(() => StringUtil.renderTemplate(testOpt)).toThrow();
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
