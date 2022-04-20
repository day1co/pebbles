import Mustache from 'mustache';
import type { Tag, TemplateOpts } from './string-util.interface';

const DOMESTIC_PHONE_NUMBER_REGEXP = /^0[1,7]\d{9}$/;

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

  export function normalizePhoneNumber(str: string): string {
    if (DOMESTIC_PHONE_NUMBER_REGEXP.test(str)) {
      return str;
    }

    const NATIONAL_PHONE_NUMBER_REGEXP = /^0?820?[1,7]\d{9}$/;
    const trimmedPhoneNumber = str.split(/\D/).join('');

    if (NATIONAL_PHONE_NUMBER_REGEXP.test(trimmedPhoneNumber)) {
      return '0' + trimmedPhoneNumber.slice(-10);
    }
    return trimmedPhoneNumber;
  }

  export function isValidPhoneNumber(str: string): boolean {
    return DOMESTIC_PHONE_NUMBER_REGEXP.test(str);
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
