import Mustache from 'mustache';
import type { MaskingOpts, Tag, TemplateOpts } from './string-util.interface';
import type { PrivacyType } from './string-util.type';

const KOREA_COUNTRY_NUMBER_REGEXP = /^(\+?82-?|0)/;
const KOREA_MOBILE_PREFIXES_REGEXP = /10|11|12|15|16|17|18|19/;
const KOREA_AREA_CODES_REGEXP = /2|31|32|33|41|42|43|44|51|52|53|54|55|61|62|63|64/;
const KOREA_SERVICE_PREFIXES_REGEXP = /50\d?|70/;
const KOREA_BASIC_PHONE_NUMBER_REGEXP = /\d{3,4}-?\d{4}$/;
const KOREA_PHONE_NUMBER_REGEXP = new RegExp(
  `${KOREA_COUNTRY_NUMBER_REGEXP.source}(${KOREA_MOBILE_PREFIXES_REGEXP.source}|${KOREA_AREA_CODES_REGEXP.source}|${KOREA_SERVICE_PREFIXES_REGEXP.source})-?${KOREA_BASIC_PHONE_NUMBER_REGEXP.source}`
);
const KOREA_ROAD_NAME_ADDRESS_REGEXP = /길|로/;
const KOREA_LOT_NUMBER_ADDRESS_REGEXP = /읍|면|동|가/;
const KOREA_ADDRESS_SORT_REGEXP = new RegExp(
  `${KOREA_ROAD_NAME_ADDRESS_REGEXP.source}|${KOREA_LOT_NUMBER_ADDRESS_REGEXP.source}`
);
const EMOJI_REGEXP =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

export namespace StringUtil {
  export function maskPrivacy(text: string, type: PrivacyType): string {
    let start: number;
    let end: number;

    switch (type) {
      case 'bankAccount':
        start = 3;
        end = text.length - 3;
        return getMaskedString({ text, length: end - start, maskingStart: start });

      case 'email':
        start = 2;
        end = text.indexOf('@');
        return getMaskedString({ text, length: end - start, maskingStart: start });

      case 'name':
        start = EMOJI_REGEXP.test(text.slice(0, 2)) ? 2 : 1;
        end = EMOJI_REGEXP.test(text.slice(text.length - 2)) ? text.length - 2 : text.length - 1;

        return getMaskedString({ text, length: end - start || 1, maskingStart: start });

      case 'phone':
        if (/\D/.test(text)) {
          const { start: _start, end: _end } = getMaskingIndexOfUnnormalizedPhone(text);
          start = _start;
          end = _end;
        } else {
          start = 3;
          end = text.length - 4;
        }
        return getMaskedString({ text, length: end - start, maskingStart: start });

      case 'address':
        start = getMaskingStartIndexOfAddress(text);
        end = text.length;
        return getMaskedString({ text, length: end - start, maskingStart: start });
    }

    function getMaskedString({ text, length, maskingStart }: MaskingOpts): string {
      const validLength = Math.max(0, length);
      const masking = '*'.repeat(validLength);
      const textSplit = [...text];
      textSplit.splice(maskingStart, validLength, masking);
      return textSplit.join('');
    }

    function getMaskingIndexOfUnnormalizedPhone(phone: string): { start: number; end: number } {
      const phoneNumberParts = phone.split(/\D/);

      let middleIndex = Math.floor(phoneNumberParts.length / 2);

      if (/\D/.test(phone[0]) && phoneNumberParts.length % 2) {
        middleIndex++;
      }

      const start = phoneNumberParts.slice(0, middleIndex).join(' ').length;
      const end = phoneNumberParts.slice(0, middleIndex + 1).join(' ').length + 1;
      return { start, end };
    }

    function getMaskingStartIndexOfAddress(address: string): number {
      let returnIndex = address.length;
      const districtsOfAddress = address.split(' ');

      for (let idx = 0; idx < districtsOfAddress.length; idx++) {
        const district = districtsOfAddress[idx];
        const districtSort = district.slice(-1);
        const nextDistrictSort = districtsOfAddress[idx + 1]?.slice(-1);

        const breakCondition = KOREA_ROAD_NAME_ADDRESS_REGEXP.test(districtSort)
          ? KOREA_ROAD_NAME_ADDRESS_REGEXP.test(nextDistrictSort) || !KOREA_ADDRESS_SORT_REGEXP.test(nextDistrictSort)
          : !KOREA_ADDRESS_SORT_REGEXP.test(nextDistrictSort);
        // OO시 OO구 OO로 OO길 123 ==> OO시 OO구 OO로 XXX XXX
        // OO시 OO동 OO로 123     ==> OO시 OO동 OO로 XXX
        // OO시 OO로 123         ==> OO시 OO로 XXX

        const condition = districtSort && KOREA_ADDRESS_SORT_REGEXP.test(districtSort) && breakCondition;

        if (condition) {
          returnIndex = districtsOfAddress.slice(0, idx + 1).join(' ').length;
          break;
        }
      }
      return returnIndex;
    }
  }

  /** @deprecated in favor of maskPrivacy */
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

  export function normalizeKoreaPhoneNumber(str: string, fallback?: unknown): string {
    const trimmedStr = str.trim();

    if (!isValidKoreaPhoneNumber(trimmedStr)) {
      if (!fallback) {
        throw new Error('Not a valid Korea phone number');
      }

      return typeof fallback === 'function' ? fallback() : fallback;
    }

    return trimmedStr.replace(KOREA_COUNTRY_NUMBER_REGEXP, '0').replace(/-/g, '');
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
