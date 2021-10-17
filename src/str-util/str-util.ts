export namespace StrUtil {
  export function compactTextMessage(fullText: string, textToBeTrimmed: string, maxByteLength = 90): string {
    if (getByteLength(fullText) <= maxByteLength) {
      return fullText;
    }

    const minByteLength = getByteLength(fullText.replace(textToBeTrimmed, '...'));
    const trimmedText = substringByByte(textToBeTrimmed, maxByteLength - minByteLength);

    return fullText.replace(textToBeTrimmed, trimmedText + '...');
  }

  /**@private */
  function getByteLength(string: string): number {
    let byte = 0;
    let decimalUnicode: number;

    for (let i = 0; (decimalUnicode = string.charCodeAt(i)); i++) {
      byte += decimalUnicode >> 11 ? 2 : 1;
    }
    return byte;
  }

  /**@private */
  function substringByByte(string: string, byteLength: number): string {
    let byte = 0;
    let i = 0;

    for (const lengthOfString = string.length; i < lengthOfString; i++) {
      const encodedChar = escape(string.charAt(i));

      // 인코딩 결과값의 길이가 4가 넘으면 ASCII 문자에 해당하지 않음.
      if (encodedChar.length >= 4) {
        byte += 2;
      } else if (encodedChar !== '%0D') {
        byte++;
      }

      if (byte > byteLength) {
        // \n일 경우
        if (encodedChar === '%0A') {
          i--;
        }
        break;
      }
    }
    return string.substring(0, i);
  }
}
