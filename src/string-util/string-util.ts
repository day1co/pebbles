import type { Tag } from './string-util.interface';
import { LoggerFactory } from '../logger';

const TRUE_REGEXP = /^(t(rue)?|y(es)?|on|1)$/i;
const FALSE_REGEXP = /^(f(alse)?|n(o)?|off|0)$/i;

const logger = LoggerFactory.getLogger('common-util:string-util');

export namespace StringUtil {
  export function toInt(numStr: string | number): number | null {
    let result: number | null;

    if (typeof numStr === 'number') {
      result = numStr;
    } else {
      result = isNumeric(numStr) ? parseFloat(numStr) : null;
    }

    if (!Number.isInteger(result)) {
      logger.warn('incompatible parmeter with integer type "%s" caught at toInt', numStr);
      result = null;
    }
    return result;
  }

  export function toNumber(numStr: string | number): number | null {
    let result: number | null;

    if (typeof numStr === 'number') {
      result = numStr;
    } else {
      result = isNumeric(numStr) ? Number(numStr) : null;
    }

    if (!Number.isFinite(result)) {
      logger.warn('incompatible parmeter with number type "%s" caught at toNumber', numStr);
      result = null;
    }
    return result;
  }

  export function toBoolean(boolStr: string | boolean): boolean | null {
    if (typeof boolStr === 'boolean') {
      return boolStr;
    }
    if (TRUE_REGEXP.test(boolStr.toLowerCase())) {
      return true;
    }
    if (FALSE_REGEXP.test(boolStr.toLowerCase())) {
      return false;
    }
    logger.warn('incompatible parmeter with boolean type "%s" caught at toBoolean', boolStr);
    return null;
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

  export function joinTags(tags: Tag[], separator = ','): string {
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

function isNumeric(str: string): boolean {
  return !Number.isNaN(Number(str)) && !Number.isNaN(parseInt(str));
}
