import Mustache from 'mustache';
import type { Tag, TemplateOpts } from './string-util.interface';

const KOREA_COUNTRY_NUMBER_REGEXP = /^(\+?82-?|0)/;
const KOREA_MOBILE_PREFIXES_REGEXP = /10|11|12|15|16|17|18|19/;
const KOREA_AREA_CODES_REGEXP = /2|31|32|33|41|42|43|44|51|52|53|54|55|61|62|63|64/;
const KOREA_SERVICE_PREFIXES_REGEXP = /50\d?|70/;
const KOREA_BASIC_PHONE_NUMBER_REGEXP = /\d{3,4}-?\d{4}$/;
const KOREA_PHONE_NUMBER_REGEXP = new RegExp(
  `${KOREA_COUNTRY_NUMBER_REGEXP.source}(${KOREA_MOBILE_PREFIXES_REGEXP.source}|${KOREA_AREA_CODES_REGEXP.source}|${KOREA_SERVICE_PREFIXES_REGEXP.source})-?${KOREA_BASIC_PHONE_NUMBER_REGEXP.source}`
);

export namespace StringUtil {
  export function midMask(str: string, startIndex: number, length: number, maskChar = '*'): string {
    const strList = [...str];
    const maskingPart = maskChar.repeat(length);

    strList.splice(startIndex, length, maskingPart);
    return strList.join('');
  }

  export function getNonce(nonceLength: number, nonceEncoding: number): string {
    let nonceString = '';

    while (nonceString.length < nonceLength) {
      nonceString += Math.random().toString(nonceEncoding).substring(2);
    }

    return nonceString.substring(nonceString.length - nonceLength);
  }

  export function renderTemplate(templateOpts: Readonly<TemplateOpts>): string {
    const { template, view, partial, customTag } = templateOpts;
    return Mustache.render(template, view, partial, customTag);
  }

  export function isValidKoreaPhoneNumber(str: string): boolean {
    return KOREA_PHONE_NUMBER_REGEXP.test(str);
  }

  export function normalizeKoreaPhoneNumber(str: string): string {
    if (!isValidKoreaPhoneNumber(str)) {
      throw new Error('Not a valid Korea phone number');
    }

    return str.replace(KOREA_COUNTRY_NUMBER_REGEXP, '0').replace(/-/g, '');
  }

  /** @deprecated */
  export function normalizePhoneNumber(str: string): string {
    if (isValidPhoneNumber(str)) {
      return str;
    }

    const NATIONAL_PHONE_NUMBER_REGEXP = /^0?820?[1,7]\d{9}$/;
    const trimmedPhoneNumber = str.split(/\D/).join('');

    if (NATIONAL_PHONE_NUMBER_REGEXP.test(trimmedPhoneNumber)) {
      return '0' + trimmedPhoneNumber.slice(-10);
    }
    return trimmedPhoneNumber;
  }

  /** @deprecated */
  export function isValidPhoneNumber(str: string): boolean {
    return /^0[1,7]\d{9}$/.test(str);
  }

  export function isValidEmail(str: string): boolean {
    const EMAIL_REGEXP =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return EMAIL_REGEXP.test(str);
  }

  export function splitTags(str: string, separator = ','): Tag[] {
    return split(str, separator).map((text) => {
      return { text };
    });
  }

  export function split(str: string, separator = ','): string[] {
    return str.split(separator).reduce((textList: string[], text) => {
      text = text.trim();
      if (text.length > 0) {
        textList.push(text);
      }
      return textList;
    }, []);
  }

  export function joinTags(tags: Readonly<Tag[]>, separator = ','): string {
    const textList = tags.map((tag) => {
      return tag.text;
    });
    return join(textList, separator);
  }

  export function join(textList: string[], separator = ','): string {
    return textList.reduce((joinedText: string, text) => {
      if (joinedText) {
        joinedText += separator;
      }
      return joinedText + text.trim();
    }, '');
  }

  export function compactTextMessage(fullText: string, textToBeTrimmed: string, maxByteLength = 90): string {
    if (getStringByteInEUCKR(fullText) <= maxByteLength) {
      return fullText;
    }

    const minByteLength = getStringByteInEUCKR(fullText.replace(textToBeTrimmed, '...'));
    const trimmedText = substringByByteInEUCKR(textToBeTrimmed, maxByteLength - minByteLength);
    return fullText.replace(textToBeTrimmed, trimmedText + '...');
  }

  /** @deprecated */
  export const escapeCsv = (s: string) => {
    return s ? `"${s}"` : '';
  };
}

function getCharacterByteInEUCKR(character: string): number {
  return character.charCodeAt(0) > 127 ? 2 : 1;
}

function getStringByteInEUCKR(str: string): number {
  let byte = 0;

  for (let i = 0; i < str.length; i++) {
    byte += getCharacterByteInEUCKR(str[i]);
  }
  return byte;
}

function substringByByteInEUCKR(str: string, byteLength: number): string {
  let i = 0;

  for (let byte = 0; byte <= byteLength; i++) {
    byte += getCharacterByteInEUCKR(str[i]);
  }
  return str.substring(0, i - 1);
}
