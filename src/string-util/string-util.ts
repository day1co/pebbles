export namespace StringUtil {
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

function getStringByteInEUCKR(string: string): number {
  let byte = 0;

  for (let i = 0; i < string.length; i++) {
    byte += getCharacterByteInEUCKR(string[i]);
  }
  return byte;
}

function substringByByteInEUCKR(string: string, byteLength: number): string {
  let i = 0;

  for (let byte = 0; byte <= byteLength; i++) {
    byte += getCharacterByteInEUCKR(string[i]);
  }
  return string.substring(0, i - 1);
}
