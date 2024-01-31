import Mustache from 'mustache';
import type { MaskingOpts, Tag, TemplateOpts, MaskingRange } from './string-util.interface';
import type { PrivacyType } from './string-util.type';

const KOREA_COUNTRY_NUMBER_REGEXP = /^(\+?0?82-?|0)/;
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

//이모지 정규식 표현
const EMOJI_REGEXP = /([\uD800-\uDBFF][\uDC00-\uDFFF])/;
//ZERO WIDTH JOINER = 다중이모지에서 이모지 끼리 붙일 때 쓰이는 코드
const EMOJI_ZERO_WIDTH_JOINER = '\u200D';

export namespace StringUtil {
  export function maskPrivacy(text: string, type: PrivacyType): string {
    if (type === 'offshoring') {
      return text.replaceAll(/[0-9]/g, '*');
    }

    const maskingRule: Record<Exclude<PrivacyType, 'offshoring'>, MaskingRange> = {
      name: { start: 1, end: text.length - 1 },
      phone: { start: 3, end: text.length - 4 },
      email: { start: 2, end: text.indexOf('@') },
      bankAccount: { start: 3, end: text.length - 3 },
      address: { start: getMaskingStartIndexOfAddress(text), end: text.length },
      resident: { start: text.charAt(6) === '-' ? 7 : 6, end: text.length },
    };

    const start = maskingRule[type].start;
    const end = maskingRule[type].end;
    const length = type === 'name' ? end - start || 1 : end - start;

    return getMaskedString({ text, length, maskingStart: start });

    function getMaskedString({ text, length, maskingStart }: MaskingOpts): string {
      //emoji가 있는 name에 대해서 따로 처리 = 현재 이모지는 name에만 존재함.
      if (EMOJI_REGEXP.test(text)) {
        return getMaskedWithEmoji(text);
      }

      const validLength = Math.max(0, length);
      const masking = '*'.repeat(validLength);
      const textSplit = [...text];
      textSplit.splice(maskingStart, validLength, masking);

      return textSplit.join('');
    }

    function getMaskedWithEmoji(text: string): string {
      const charOfText = enumerateCharOfText(text);

      let maskedName = '';

      charOfText.forEach((char, index) => {
        if (index !== 0 && (charOfText.length === 2 || index !== charOfText.length - 1)) {
          maskedName += '*';
        } else {
          maskedName += char;
        }
      });

      return maskedName;
    }

    function enumerateCharOfText(text: string): string[] {
      //emoji 정규식으로 emoji와 emoji가 아닌 글자로 split
      const splitNamesByEmoji = text.split(EMOJI_REGEXP);
      const charList: string[] = [];
      let emoji = '';

      splitNamesByEmoji.forEach((splitName) => {
        if (EMOJI_ZERO_WIDTH_JOINER !== splitName && !EMOJI_REGEXP.test(splitName)) {
          //👩‍👩‍👧같은 다중 이모지는 ["👩‍👩‍👧"]로 인식하기 위해 배열에 한번에 push
          if (emoji) {
            charList.push(emoji);
            emoji = '';
          }
          //emoji가 아닌 글자는 글자수대로 배열에 push
          charList.push(...splitName);
        } else {
          //👩‍👩‍👧같은 다중 이모지는 ["👩","","👩","","👧"]로 인식해서 하나로 합치기 위함.
          emoji += splitName;
        }
      });

      if (emoji) {
        charList.push(emoji);
      }

      //char[]로 각 index마다 한 글자씩 담은 배열
      return charList;
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

  /** @deprecated */
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

  export function normalizePhoneNumber(str: string, fallback?: unknown): string {
    if (typeof str !== 'string') {
      if (!fallback) {
        throw new Error('Not a valid phone number');
      }
      return typeof fallback === 'function' ? fallback() : fallback;
    }

    const trimmedStr = str.trim().replaceAll(' ', '');

    if (isValidKoreaPhoneNumber(trimmedStr)) {
      return trimmedStr.replace(KOREA_COUNTRY_NUMBER_REGEXP, '0').replace(/-/g, '');
    }

    if (fallback) {
      return typeof fallback === 'function' ? fallback(str) : fallback;
    }

    return trimmedStr ? trimmedStr.replaceAll('-', '') : '';
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
