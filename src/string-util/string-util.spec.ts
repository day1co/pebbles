import { StringUtil } from './string-util';
import { TemplateOpts } from './string-util.interface';

describe('StringUtil', () => {
  describe('maskPrivacy', () => {
    it('should return original parameter when nothing is to be masked', () => {
      expect(StringUtil.maskPrivacy('', 'address')).toBe('');
      expect(StringUtil.maskPrivacy('', 'bankAccount')).toBe('');
      expect(StringUtil.maskPrivacy('', 'email')).toBe('');
      expect(StringUtil.maskPrivacy('', 'name')).toBe('');
      expect(StringUtil.maskPrivacy('', 'phone')).toBe('');
    });

    it('should mask names except the first and last characters', () => {
      const testName1 = '김';
      const testName2 = '😆';
      const testName3 = 'John Doe';
      const testName4 = '김이';
      const testName5 = 'John Doe 김이박';
      const testName6 = '⌯’ㅅ’⌯';
      const testName7 = 'hi👩‍👩‍👧im🤰family';
      const testName8 = '은빈🎄';
      const testName9 = '빈🎄';
      const testName10 = '松村松村松村';
      const testName11 = 'ツツ智永ツツイツイ';
      const testName12 = 'Okasdwa woaidwi';
      const testName13 = '磯   太';
      const testName14 = '홍@길@동';
      const testName15 = '박!@#@검';
      const testName16 = '(주)비전비전비전';
      const testName17 = '항상 행복행복^^♡';

      expect(StringUtil.maskPrivacy(testName1, 'name')).toBe(testName1);
      expect(StringUtil.maskPrivacy(testName2, 'name')).toBe(testName2);
      expect(StringUtil.maskPrivacy(testName3, 'name')).toBe('J******e');
      expect(StringUtil.maskPrivacy(testName4, 'name')).toBe('김*');
      expect(StringUtil.maskPrivacy(testName5, 'name')).toBe('J**********박');
      expect(StringUtil.maskPrivacy(testName6, 'name')).toBe('⌯***⌯');
      expect(StringUtil.maskPrivacy(testName7, 'name')).toBe('h**********y');
      expect(StringUtil.maskPrivacy(testName8, 'name')).toBe('은*🎄');
      expect(StringUtil.maskPrivacy(testName9, 'name')).toBe('빈*');
      expect(StringUtil.maskPrivacy(testName10, 'name')).toBe('松****村');
      expect(StringUtil.maskPrivacy(testName11, 'name')).toBe('ツ*******イ');
      expect(StringUtil.maskPrivacy(testName12, 'name')).toBe('O*************i');
      expect(StringUtil.maskPrivacy(testName13, 'name')).toBe('磯***太');
      expect(StringUtil.maskPrivacy(testName14, 'name')).toBe('홍***동');
      expect(StringUtil.maskPrivacy(testName15, 'name')).toBe('박****검');
      expect(StringUtil.maskPrivacy(testName16, 'name')).toBe('(*******전');
      expect(StringUtil.maskPrivacy(testName17, 'name')).toBe('항********♡');
    });

    it('should mask bank accounts from the fourth character to the last fourth character', () => {
      const testBankAccount1 = '123456';
      const testBankAccount2 = '1234567890';
      const testBankAccount3 = '1234567890123';
      const testBankAccount4 = '1234567890123456';
      const expectedMaskedBankAccount1 = '123456';
      const expectedMaskedBankAccount2 = '123****890';
      const expectedMaskedBankAccount3 = '123*******123';
      const expectedMaskedBankAccount4 = '123**********456';

      expect(StringUtil.maskPrivacy(testBankAccount1, 'bankAccount')).toBe(expectedMaskedBankAccount1);
      expect(StringUtil.maskPrivacy(testBankAccount2, 'bankAccount')).toBe(expectedMaskedBankAccount2);
      expect(StringUtil.maskPrivacy(testBankAccount3, 'bankAccount')).toBe(expectedMaskedBankAccount3);
      expect(StringUtil.maskPrivacy(testBankAccount4, 'bankAccount')).toBe(expectedMaskedBankAccount4);
    });

    it('should mask emails from the third character to the character before @', () => {
      const testEmail1 = 'test@test.com';
      const testEmail2 = '12test@test.com';
      const testEmail3 = '__testtesttesttest@test.com';
      const testEmail4 = 'te@test.com';
      const expectedTestEmail1 = 'te**@test.com';
      const expectedTestEmail2 = '12****@test.com';
      const expectedTestEmail3 = '__****************@test.com';
      const expectedTestEmail4 = 'te@test.com';

      expect(StringUtil.maskPrivacy(testEmail1, 'email')).toBe(expectedTestEmail1);
      expect(StringUtil.maskPrivacy(testEmail2, 'email')).toBe(expectedTestEmail2);
      expect(StringUtil.maskPrivacy(testEmail3, 'email')).toBe(expectedTestEmail3);
      expect(StringUtil.maskPrivacy(testEmail4, 'email')).toBe(expectedTestEmail4);
    });

    it('should mask phone numbers from the fourth character to the last fifth character', () => {
      const testPhone1 = '01011118888';
      const testPhone2 = '0101118888';
      const testPhone3 = '010-1111-8888';
      const testPhone4 = '+1 111 8888';
      const testPhone5 = '+1 111-1111-11111';
      const testPhone6 = '+8180 6093 8228';
      const testPhone7 = '+44 07707467598';
      const testPhone8 = '+971 50 779 7658';
      const expectedTestPhone1 = '010****8888';
      const expectedTestPhone2 = '010***8888';
      const expectedTestPhone3 = '010******8888';
      const expectedTestPhone4 = '+1 ****8888';
      const expectedTestPhone5 = '+1 **********1111';
      const expectedTestPhone6 = '+81********8228';
      const expectedTestPhone7 = '+44********7598';
      const expectedTestPhone8 = '+97*********7658';

      expect(StringUtil.maskPrivacy(testPhone1, 'phone')).toBe(expectedTestPhone1);
      expect(StringUtil.maskPrivacy(testPhone2, 'phone')).toBe(expectedTestPhone2);
      expect(StringUtil.maskPrivacy(testPhone3, 'phone')).toBe(expectedTestPhone3);
      expect(StringUtil.maskPrivacy(testPhone4, 'phone')).toBe(expectedTestPhone4);
      expect(StringUtil.maskPrivacy(testPhone5, 'phone')).toBe(expectedTestPhone5);
      expect(StringUtil.maskPrivacy(testPhone6, 'phone')).toBe(expectedTestPhone6);
      expect(StringUtil.maskPrivacy(testPhone7, 'phone')).toBe(expectedTestPhone7);
      expect(StringUtil.maskPrivacy(testPhone8, 'phone')).toBe(expectedTestPhone8);
    });

    it('should mask Korean address', () => {
      const testAddress1 = '강원 원주시 학성동 12아파트';
      const testAddress2 = '서울특별시 강남구 역삼동 12번지 34빌딩';
      const testAddress3 = '서울 영등포구 양평동5가 12-3 456호';
      const testAddress4 = '충북 보은군 회남면 신곡리 산12-3';
      const testAddress5 = '세종 어진동 123 45호';
      const testAddress6 = '세종특별자치시 한누리대로 1234';
      const testAddress7 = '서울 강남구 강남대로 123길 45 67빌딩';
      const testAddress8 = '경남 양산시 물금읍 가촌서로 12345';
      const testAddress9 = '전북 남원시 사매면 서도길 1234';
      const testAddress10 = '부산 해운대구 달맞이길117번가길 123-45';

      const expectedTestAddress1 = testAddress1.replace(' 12아파트', '*'.repeat(' 12아파트'.length));
      const expectedTestAddress2 = testAddress2.replace(' 12번지 34빌딩', '*'.repeat(' 12번지 34빌딩'.length));
      const expectedTestAddress3 = testAddress3.replace(' 12-3 456호', '*'.repeat(' 12-3 456호'.length));
      const expectedTestAddress4 = testAddress4.replace(' 신곡리 산12-3', '*'.repeat(' 신곡리 산12-3'.length));
      const expectedTestAddress5 = testAddress5.replace(' 123 45호', '*'.repeat(' 123 45호'.length));
      const expectedTestAddress6 = testAddress6.replace(' 1234', '*'.repeat(' 1234'.length));
      const expectedTestAddress7 = testAddress7.replace(' 123길 45 67빌딩', '*'.repeat(' 123길 45 67빌딩'.length));
      const expectedTestAddress8 = testAddress8.replace(' 12345', '*'.repeat(' 12345'.length));
      const expectedTestAddress9 = testAddress9.replace(' 1234', '*'.repeat(' 1234'.length));
      const expectedTestAddress10 = testAddress10.replace(' 123-45', '*'.repeat(' 123-45'.length));

      expect(StringUtil.maskPrivacy(testAddress1, 'address')).toBe(expectedTestAddress1);
      expect(StringUtil.maskPrivacy(testAddress2, 'address')).toBe(expectedTestAddress2);
      expect(StringUtil.maskPrivacy(testAddress3, 'address')).toBe(expectedTestAddress3);
      expect(StringUtil.maskPrivacy(testAddress4, 'address')).toBe(expectedTestAddress4);
      expect(StringUtil.maskPrivacy(testAddress5, 'address')).toBe(expectedTestAddress5);
      expect(StringUtil.maskPrivacy(testAddress6, 'address')).toBe(expectedTestAddress6);
      expect(StringUtil.maskPrivacy(testAddress7, 'address')).toBe(expectedTestAddress7);
      expect(StringUtil.maskPrivacy(testAddress8, 'address')).toBe(expectedTestAddress8);
      expect(StringUtil.maskPrivacy(testAddress9, 'address')).toBe(expectedTestAddress9);
      expect(StringUtil.maskPrivacy(testAddress10, 'address')).toBe(expectedTestAddress10);
    });

    it('should mask resident number', () => {
      const testResidentNumber1 = '990101';
      const testResidentNumber2 = '990101-1234567';
      const testResidentNumber3 = '990101-123';
      const testResidentNumber4 = '9901011234567';
      const testResidentNumber5 = '999';

      expect(StringUtil.maskPrivacy(testResidentNumber1, 'resident')).toBe('990101');
      expect(StringUtil.maskPrivacy(testResidentNumber2, 'resident')).toBe('990101-*******');
      expect(StringUtil.maskPrivacy(testResidentNumber3, 'resident')).toBe('990101-***');
      expect(StringUtil.maskPrivacy(testResidentNumber4, 'resident')).toBe('990101*******');
      expect(StringUtil.maskPrivacy(testResidentNumber5, 'resident')).toBe('999');
    });

    it('should mask offshoring number', () => {
      const testOffshoring1 = '123456';
      const testOffshoring2 = '123-456-7890';
      const testOffshoring3 = '123-456789-0123';
      const testOffshoring4 = '1234567890';
      const testOffshoring5 = '123';

      expect(StringUtil.maskPrivacy(testOffshoring1, 'offshoring')).toBe('******');
      expect(StringUtil.maskPrivacy(testOffshoring2, 'offshoring')).toBe('***-***-****');
      expect(StringUtil.maskPrivacy(testOffshoring3, 'offshoring')).toBe('***-******-****');
      expect(StringUtil.maskPrivacy(testOffshoring4, 'offshoring')).toBe('**********');
      expect(StringUtil.maskPrivacy(testOffshoring5, 'offshoring')).toBe('***');
    });
  });

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
    const normalizePhoneNumber = StringUtil.normalizePhoneNumber;
    const mobileNumber = '01012345678';
    const localNumber = '0212345678';
    const personalNumber = '050512345678';
    const voipNumber = '07012345678';
    it('should normalize phone number starting with 010 or 070', () => {
      expect(normalizePhoneNumber('01012345678')).toBe(mobileNumber);
      expect(normalizePhoneNumber('010-1234-5678')).toBe(mobileNumber);
      expect(normalizePhoneNumber('0212345678')).toBe(localNumber);
      expect(normalizePhoneNumber('02-1234-5678')).toBe(localNumber);
      expect(normalizePhoneNumber('050512345678')).toBe(personalNumber);
      expect(normalizePhoneNumber('0505-1234-5678')).toBe(personalNumber);
      expect(normalizePhoneNumber('07012345678')).toBe(voipNumber);
      expect(normalizePhoneNumber('070-1234-5678')).toBe(voipNumber);
      expect(normalizePhoneNumber('031 1234 5678')).toBe('03112345678');
    });
    it('should normalize phone number starting with (+)82 or (+)082 or + 82', () => {
      expect(normalizePhoneNumber('+821012345678')).toBe(mobileNumber);
      expect(normalizePhoneNumber('+82-10-1234-5678')).toBe(mobileNumber);
      expect(normalizePhoneNumber('+082-10-1234-5678')).toBe(mobileNumber);
      expect(normalizePhoneNumber('+82 10-1234-5678')).toBe(mobileNumber);
      expect(normalizePhoneNumber('821012345678')).toBe(mobileNumber);
      expect(normalizePhoneNumber('82-10-1234-5678')).toBe(mobileNumber);
      expect(normalizePhoneNumber('+82212345678')).toBe(localNumber);
      expect(normalizePhoneNumber('+82-2-1234-5678')).toBe(localNumber);
      expect(normalizePhoneNumber('+082-2-1234-5678')).toBe(localNumber);
      expect(normalizePhoneNumber('+82 2-1234-5678')).toBe(localNumber);
      expect(normalizePhoneNumber('82212345678')).toBe(localNumber);
      expect(normalizePhoneNumber('82-2-1234-5678')).toBe(localNumber);
      expect(normalizePhoneNumber('+82-50512345678')).toBe(personalNumber);
      expect(normalizePhoneNumber('+82-505-1234-5678')).toBe(personalNumber);
      expect(normalizePhoneNumber('+082-505-1234-5678')).toBe(personalNumber);
      expect(normalizePhoneNumber('+82 505-1234-5678')).toBe(personalNumber);
      expect(normalizePhoneNumber('82-50512345678')).toBe(personalNumber);
      expect(normalizePhoneNumber('82-505-1234-5678')).toBe(personalNumber);
      expect(normalizePhoneNumber('+827012345678')).toBe(voipNumber);
      expect(normalizePhoneNumber('+82-70-1234-5678')).toBe(voipNumber);
      expect(normalizePhoneNumber('+082-70-1234-5678')).toBe(voipNumber);
      expect(normalizePhoneNumber('+82 70-1234-5678')).toBe(voipNumber);
      expect(normalizePhoneNumber('827012345678')).toBe(voipNumber);
      expect(normalizePhoneNumber('82-70-1234-5678')).toBe(voipNumber);
    });
    it('should throw for the not-valid-in-Korea phone number and no fallback', () => {
      expect(normalizePhoneNumber('01012345678a')).toBe('01012345678a');
      expect(normalizePhoneNumber('1012345678')).toBe('1012345678');
      expect(normalizePhoneNumber('010123456789')).toBe('010123456789');
      expect(normalizePhoneNumber('02.1234.5678')).toBe('02.1234.5678');
      expect(normalizePhoneNumber('041-12-3456')).toBe('041123456');
      expect(normalizePhoneNumber('051-1234-567')).toBe('0511234567');
      expect(normalizePhoneNumber('+82-090-1234-5678')).toBe('+8209012345678');
      expect(normalizePhoneNumber('+82-010-1234-5678')).toBe('+8201012345678');
      expect(normalizePhoneNumber('+1-10-1234-5678')).toBe('+11012345678');
    });
    it('should return fallback for the not-valid-in-Korea phone number', () => {
      expect(normalizePhoneNumber('01012345678a', 'fallback')).toBe('fallback');
    });

    it('should throw error for not string type property without fallback', () => {
      expect(() => normalizePhoneNumber(821012345678 as any)).toThrow(
        'Not a valid phone number. phone number must be a string'
      );
      expect(() => normalizePhoneNumber(null as any)).toThrow(
        'Not a valid phone number. phone number must be a string'
      );
      expect(() => normalizePhoneNumber(undefined as any)).toThrow(
        'Not a valid phone number. phone number must be a string'
      );
    });

    it('should return fallback for not string type property', () => {
      expect(normalizePhoneNumber(821012345678 as any, 'fallback')).toBe('fallback');
      expect(normalizePhoneNumber(null as any, 'fallback')).toBe('fallback');
      expect(normalizePhoneNumber(undefined as any, 'fallback')).toBe('fallback');
    });
  });

  describe('isValidKoreaPhoneNumber', () => {
    const isValidKoreaPhoneNumber = StringUtil.isValidKoreaPhoneNumber;
    it('should return true for a Korea phone number', () => {
      expect(isValidKoreaPhoneNumber('01012345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('821012345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('010-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('+82-10-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('82-10-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('0212345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('82212345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('02-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('+82-2-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('82-2-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('021234567')).toBe(true);
      expect(isValidKoreaPhoneNumber('8221234567')).toBe(true);
      expect(isValidKoreaPhoneNumber('02-123-4567')).toBe(true);
      expect(isValidKoreaPhoneNumber('+82-2-123-4567')).toBe(true);
      expect(isValidKoreaPhoneNumber('82-2-123-4567')).toBe(true);
      expect(isValidKoreaPhoneNumber('04412345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('824412345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('044-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('+82-44-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('82-44-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('07012345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('827012345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('070-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('+82-70-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('82-70-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('050512345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('8250512345678')).toBe(true);
      expect(isValidKoreaPhoneNumber('0505-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('+82-505-1234-5678')).toBe(true);
      expect(isValidKoreaPhoneNumber('82-505-1234-5678')).toBe(true);
    });
    it('should return false for a wrong string', () => {
      expect(isValidKoreaPhoneNumber('01012345678a')).toBe(false);
      expect(isValidKoreaPhoneNumber('1012345678')).toBe(false);
      expect(isValidKoreaPhoneNumber('010123456789')).toBe(false);
      expect(isValidKoreaPhoneNumber('02.1234.5678')).toBe(false);
      expect(isValidKoreaPhoneNumber('031 1234 5678')).toBe(false);
      expect(isValidKoreaPhoneNumber('041-12-3456')).toBe(false);
      expect(isValidKoreaPhoneNumber('051-1234-567')).toBe(false);
      expect(isValidKoreaPhoneNumber('+82-090-1234-5678')).toBe(false);
      expect(isValidKoreaPhoneNumber('+82-010-1234-5678')).toBe(false);
      expect(isValidKoreaPhoneNumber('+1-10-1234-5678')).toBe(false);
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
