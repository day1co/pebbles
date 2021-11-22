import type { Tag } from './string-util.interface';
import type { TemplateViewContent } from './string-util.type';

const DOMESTIC_PHONE_NUMBER_REGEXP = /^0[1,7]\d{9}$/;

export namespace StringUtil {
  export function renderTemplate(
    template: string,
    view: Record<string, TemplateViewContent>,
    partial?: Record<string, TemplateViewContent>
  ): string {
    const TEMPLATE_SECTION_REGEXP = /{{#([^\s]*)}}([\s\S]*?){{\/\1}}/g;
    const TEMPLATE_UNESCAPE_HTML_TAG_REGEXP = /{{{([^\s]*)}}}/g;
    const TEMPLATE_ESCAPE_HTML_TAG_REGEXP = /{{([^\s]*)}}/g;
    const PARTIAL_TAG_REGEXP = /{{> ([^\s]*)}}/g;

    return template
      .replace(TEMPLATE_SECTION_REGEXP, (match: string, sectionKey: string): string => {
        const sectionStartTag = `{{#${sectionKey}}}`;
        const sectionEndTag = `{{/${sectionKey}}}`;

        const sectionStartTagIndex = template.indexOf(sectionStartTag) + sectionStartTag.length;
        const sectionEndTagIndex = template.indexOf(sectionEndTag);
        const sectionTag = template.substring(sectionStartTagIndex, sectionEndTagIndex);

        const sectionTagMatch = sectionTag.match(TEMPLATE_ESCAPE_HTML_TAG_REGEXP);

        // sectionTag가 약속된 {{}} 형태가 아니라면 section 전체 빈 string으로 return
        if (!sectionTagMatch) {
          return '';
        }

        const tagKey = sectionTagMatch[0].slice(2, -2);
        const _view = view as Record<string, Exclude<TemplateViewContent, string>>;

        const tagList = _view[sectionKey].map((tag: Record<string, string>) => {
          return tag[tagKey];
        });

        return tagList.reduce((result: string, tag: string) => {
          return result + sectionTag.replace(TEMPLATE_ESCAPE_HTML_TAG_REGEXP, tag);
        }, '');
      })
      .replace(TEMPLATE_UNESCAPE_HTML_TAG_REGEXP, (match: string, key: string): string => {
        const value = view[key] as string;
        return value === undefined ? '' : value;
      })
      .replace(TEMPLATE_ESCAPE_HTML_TAG_REGEXP, (match: string, key: string): string => {
        const value = view[key] as string;
        return value === undefined ? '' : escapeHTML(value);
      })
      .replace(PARTIAL_TAG_REGEXP, (match: string, key: string): string => {
        if (!partial) {
          return '';
        }
        const value = partial[key] as string;
        return value === undefined ? '' : value;
      });
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
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

function escapeHTML(template: string): string {
  return template
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/ /g, '&nbsp;');
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
