import type { Tag } from './string-util.interface';

export namespace StringUtil {
  export function splitTags(str: string, separator = ','): Tag[] {
    const initialList: Tag[] = [];

    return str.split(separator).reduce((tags, tag) => {
      const text = tag.trim();
      if (text.length > 0) {
        tags.push({ text });
      }
      return tags;
    }, initialList);
  }

  export function joinTags(tags: Tag[], separator = ','): string {
    return tags.reduce((joinedTags, tag) => {
      if (joinedTags) {
        joinedTags += separator;
      }
      return joinedTags + tag.text.trim();
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
